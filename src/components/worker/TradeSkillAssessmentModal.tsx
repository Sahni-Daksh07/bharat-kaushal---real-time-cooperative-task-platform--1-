import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Award,
  ChevronRight,
  ChevronLeft,
  Volume2,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Zap,
  BarChart3,
  HelpCircle,
  Check,
  Clock,
} from 'lucide-react';
import { AssessmentQuestion, AssessmentSubmissionResult, AssessmentCategory } from '../../types/assessment';
import { SupportedLanguage, getTranslation, SUPPORTED_LANGUAGES } from '../../utils/i18n';
import { generateTop15AssessmentQuestions } from '../../utils/assessmentGenerator';
import { apiFetch } from '../../utils/apiConfig';

const fetch = apiFetch;

interface TradeSkillAssessmentModalProps {
  isOpen: boolean;
  tradeField: string;
  workerName: string;
  language: SupportedLanguage;
  workerId?: string;
  onClose: () => void;
  onComplete: (result: {
    score: number;
    total: number;
    percentage: number;
    skillLevel: string;
    passed: boolean;
    tradeField: string;
  }) => void;
}

export const TradeSkillAssessmentModal: React.FC<TradeSkillAssessmentModalProps> = ({
  isOpen,
  tradeField,
  workerName,
  language,
  workerId,
  onClose,
  onComplete,
}) => {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>(language || 'en');
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<AssessmentSubmissionResult | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(900); // 15 mins for 15 questions

  useEffect(() => {
    setCurrentLang(language || 'en');
  }, [language]);

  useEffect(() => {
    if (isOpen && tradeField) {
      // Load the 15 questions
      const qs = generateTop15AssessmentQuestions(tradeField);
      setQuestions(qs);
      setCurrentIndex(0);
      setAnswers({});
      setResult(null);
      setTimeRemaining(900);
    }
  }, [isOpen, tradeField]);

  // Timer effect
  useEffect(() => {
    if (!isOpen || result || questions.length === 0) return;
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitAssessment();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, result, questions, answers]);

  if (!isOpen) return null;

  const currentQ = questions[currentIndex];
  const translation = currentQ?.translations[currentLang] || currentQ?.translations['en'];

  const handleSelectOption = (optIndex: number) => {
    if (!currentQ) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optIndex,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    // Attempt language voice
    if (currentLang === 'hi') utterance.lang = 'hi-IN';
    else if (currentLang === 'bn') utterance.lang = 'bn-IN';
    else if (currentLang === 'ta') utterance.lang = 'ta-IN';
    else if (currentLang === 'te') utterance.lang = 'te-IN';
    else if (currentLang === 'mr') utterance.lang = 'mr-IN';
    else if (currentLang === 'gu') utterance.lang = 'gu-IN';
    else if (currentLang === 'ur') utterance.lang = 'ur-PK';
    else utterance.lang = 'en-IN';

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSubmitAssessment = async () => {
    setIsSubmitting(true);
    try {
      // Calculate results
      let correctCount = 0;
      const categoryStats: Record<string, { correct: number; total: number }> = {};
      const review: any[] = [];

      questions.forEach((q) => {
        const userAns = answers[q.id];
        const isCorrect = userAns === q.correctIndex;
        if (isCorrect) correctCount++;

        if (!categoryStats[q.category]) {
          categoryStats[q.category] = { correct: 0, total: 0 };
        }
        categoryStats[q.category].total += 1;
        if (isCorrect) categoryStats[q.category].correct += 1;

        const t = q.translations[currentLang] || q.translations['en'];
        review.push({
          id: q.id,
          question: t.question,
          userSelected: userAns !== undefined ? userAns : -1,
          correctAnswer: q.correctIndex,
          isCorrect,
          explanation: t.explanation,
          category: q.category,
          difficulty: q.difficulty,
        });
      });

      const total = questions.length || 15;
      const percentage = Math.round((correctCount / total) * 100);

      let skillLevel: 'Expert' | 'Advanced' | 'Competent' | 'Intermediate' | 'Beginner' = 'Competent';
      if (percentage >= 90) skillLevel = 'Expert';
      else if (percentage >= 75) skillLevel = 'Advanced';
      else if (percentage >= 60) skillLevel = 'Competent';
      else if (percentage >= 45) skillLevel = 'Intermediate';
      else skillLevel = 'Beginner';

      const assessmentResult: AssessmentSubmissionResult = {
        score: correctCount,
        total,
        percentage,
        skillLevel,
        passed: percentage >= 50,
        categoryBreakdown: categoryStats as any,
        questionReview: review,
      };

      setResult(assessmentResult);

      // Also submit to backend if workerId exists
      if (workerId) {
        fetch('/api/worker/submit-assessment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            workerId,
            field: tradeField,
            answers,
            language: currentLang,
          }),
        }).catch((err) => console.error('Error saving assessment score:', err));
      }
    } catch (e) {
      console.error('Assessment submission error:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / (questions.length || 15)) * 100);
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {tradeField} {getTranslation(currentLang, 'skillAssessment')}
              </h2>
              <p className="text-xs text-emerald-100 flex items-center space-x-2">
                <span>{workerName || 'Skilled Craftsman'}</span>
                <span>•</span>
                <span>{t('15_Standards_Aligned_Questions_d13xc', `15 Standards-Aligned Questions`)}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Language Selector in Assessment */}
            <select
              value={currentLang}
              onChange={(e) => setCurrentLang(e.target.value as SupportedLanguage)}
              className="text-xs bg-white/20 hover:bg-white/30 text-white rounded-lg px-2.5 py-1.5 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white font-medium"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="text-slate-900 bg-white">
                  {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>

            {/* Timer if test in progress */}
            {!result && (
              <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-black/25 rounded-lg text-xs font-mono font-bold">
                <Clock className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span className={timeRemaining < 180 ? 'text-amber-300' : 'text-white'}>
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Assessment Body */}
        {!result ? (
          <div className="p-6 space-y-6">
            {/* Progress and Category Bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-medium text-slate-600 dark:text-slate-400">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                    {getTranslation(currentLang, 'questionNumber')
                      .replace('{current}', String(currentIndex + 1))
                      .replace('{total}', String(questions.length))}
                  </span>
                  {currentQ && (
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {currentQ.category} • {currentQ.difficulty}
                    </span>
                  )}
                </div>
                <span>{answeredCount}/{questions.length} {t('answered___0ogq8', `answered (`)}{progressPercent}{t('___mqueb', `%)`)}</span>
              </div>

              {/* Progress track */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Current Question Box */}
            {currentQ && translation && (
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-5 border border-slate-200 dark:border-slate-700 space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white leading-relaxed">
                    {translation.question}
                  </h3>
                  <button
                    onClick={() => speakText(`${translation.question}. Options: ${translation.options.join(', ')}`)}
                    className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                      isSpeaking
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 animate-pulse'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-emerald-100 hover:text-emerald-700'
                    }`}
                    title={t('Audio_Read_Aloud_upxwq', `Audio Read Aloud`)}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Options List */}
                <div className="space-y-2.5">
                  {translation.options.map((opt, optIdx) => {
                    const isSelected = answers[currentQ.id] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(optIdx)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-600 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-500/20 shadow-sm'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span
                            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                              isSelected
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="text-sm font-medium">{opt}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Navigation & Submit footer */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{getTranslation(currentLang, 'previousStep')}</span>
              </button>

              <div className="flex items-center space-x-3">
                {currentIndex < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition flex items-center space-x-1.5 shadow-md shadow-emerald-600/20"
                  >
                    <span>{getTranslation(currentLang, 'nextStep')}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitAssessment}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-bold hover:from-emerald-700 hover:to-teal-700 transition flex items-center space-x-2 shadow-lg shadow-emerald-600/30"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <ShieldCheck className="w-4 h-4" />
                    )}
                    <span>{getTranslation(currentLang, 'submitAssessment')}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Question Quick-jump pills */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1.5 justify-center">
              {questions.map((q, idx) => {
                const isAnswered = answers[q.id] !== undefined;
                const isCur = idx === currentIndex;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-7 h-7 text-xs font-bold rounded-lg transition-all ${
                      isCur
                        ? 'bg-emerald-600 text-white ring-2 ring-emerald-500 ring-offset-1'
                        : isAnswered
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Assessment Results Screen */
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Big Score Card */}
            <div
              className={`p-6 rounded-2xl text-center relative overflow-hidden border ${
                result.passed
                  ? 'bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-emerald-600/15 border-emerald-500/30'
                  : 'bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-amber-600/15 border-amber-500/30'
              }`}
            >
              <div className="inline-flex p-3.5 rounded-2xl bg-white dark:bg-slate-800 shadow-lg mb-3">
                {result.passed ? (
                  <CheckCircle className="w-10 h-10 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-10 h-10 text-amber-500" />
                )}
              </div>

              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {result.passed ? 'Skill Verification Certified!' : 'Assessment Completed'}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                {result.passed
                  ? `Congratulations ${workerName}, your technical competency in ${tradeField} has been verified.`
                  : `Score recorded. You can retake the assessment anytime from your worker portal.`}
              </p>

              {/* Score Number and Badge */}
              <div className="flex items-center justify-center gap-6 mt-5">
                <div className="text-center">
                  <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                    {result.score} / {result.total}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">{t('Correct_Answers_15z7a', `Correct Answers`)}</div>
                </div>
                <div className="h-10 w-px bg-slate-200 dark:bg-slate-700" />
                <div className="text-center">
                  <div className="text-3xl font-black text-slate-900 dark:text-white">
                    {result.percentage}%
                  </div>
                  <div className="text-xs text-slate-500 font-medium">{t('Accuracy_skdc2', `Accuracy`)}</div>
                </div>
                <div className="h-10 w-px bg-slate-200 dark:bg-slate-700" />
                <div className="text-center">
                  <span className="inline-block px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-bold uppercase tracking-wider">
                    {result.skillLevel}
                  </span>
                  <div className="text-xs text-slate-500 font-medium mt-1">{t('Skill_Tier_dcy85', `Skill Tier`)}</div>
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                <span>{getTranslation(currentLang, 'categoryPerformance')}</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(result.categoryBreakdown).map(([cat, rawStats]) => {
                  const stats = rawStats as { total: number; correct: number };
                  const catPercent = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
                  return (
                    <div
                      key={cat}
                      className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-2"
                    >
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-800 dark:text-slate-200">{cat}</span>
                        <span className="text-slate-600 dark:text-slate-400">
                          {stats.correct}/{stats.total} ({catPercent}{t('___fztyo', `%)`)}</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            catPercent >= 75
                              ? 'bg-emerald-500'
                              : catPercent >= 50
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${catPercent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Question by Question Review Accordion */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                <span>{getTranslation(currentLang, 'detailedReview')}</span>
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {result.questionReview.map((rev, idx) => (
                  <div
                    key={rev.id}
                    className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                      rev.isCorrect
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40'
                        : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {idx + 1}. {rev.question}
                      </div>
                      <div className="flex-shrink-0">
                        {rev.isCorrect ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                            {getTranslation(currentLang, 'correct')}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold">
                            {getTranslation(currentLang, 'incorrect')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-slate-600 dark:text-slate-400">
                      <strong>{t('Explanation__gakoa', `Explanation:`)}</strong> {rev.explanation}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  onComplete({
                    score: result.score,
                    total: result.total,
                    percentage: result.percentage,
                    skillLevel: result.skillLevel,
                    passed: result.passed,
                    tradeField,
                  });
                  onClose();
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2"
              >
                <Check className="w-4 h-4" />
                <span>{t('Complete_Registration___Procee_f9cv3', `Complete Registration & Proceed`)}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
