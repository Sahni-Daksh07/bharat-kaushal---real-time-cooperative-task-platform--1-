import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { CustomerAuthModal } from './CustomerAuthModal';
import { WorkerAuthModal } from './WorkerAuthModal';
import { SocietyAdminAuthModal } from './SocietyAdminAuthModal';
import { FederationAdminAuthModal } from './FederationAdminAuthModal';
import { SuperAdminAuthModal } from './SuperAdminAuthModal';

interface AuthModalsContainerProps {
  onOpenWorkerRegistration?: () => void;
}

export const AuthModalsContainer: React.FC<AuthModalsContainerProps> = ({
  onOpenWorkerRegistration,
}) => {
  const { activeAuthModal, authModalInitialTab, closeAuthModal } = useAuth();

  return (
    <>
      <CustomerAuthModal
        isOpen={activeAuthModal === 'CUSTOMER'}
        initialTab={authModalInitialTab as any}
        onClose={closeAuthModal}
      />
      <WorkerAuthModal
        isOpen={activeAuthModal === 'WORKER'}
        initialTab={authModalInitialTab as any}
        onClose={closeAuthModal}
        onOpenRegistration={onOpenWorkerRegistration}
      />
      <SocietyAdminAuthModal
        isOpen={activeAuthModal === 'SOCIETY_ADMIN'}
        initialTab={authModalInitialTab as any}
        onClose={closeAuthModal}
      />
      <FederationAdminAuthModal
        isOpen={activeAuthModal === 'FEDERATION_ADMIN'}
        initialTab={authModalInitialTab as any}
        onClose={closeAuthModal}
      />
      <SuperAdminAuthModal
        isOpen={activeAuthModal === 'SUPER_ADMIN'}
        initialTab={authModalInitialTab as any}
        onClose={closeAuthModal}
      />
    </>
  );
};
