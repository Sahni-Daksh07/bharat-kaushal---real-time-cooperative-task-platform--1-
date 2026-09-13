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
  const { activeAuthModal, closeAuthModal } = useAuth();

  return (
    <>
      <CustomerAuthModal
        isOpen={activeAuthModal === 'CUSTOMER'}
        onClose={closeAuthModal}
      />
      <WorkerAuthModal
        isOpen={activeAuthModal === 'WORKER'}
        onClose={closeAuthModal}
        onOpenRegistration={onOpenWorkerRegistration}
      />
      <SocietyAdminAuthModal
        isOpen={activeAuthModal === 'SOCIETY_ADMIN'}
        onClose={closeAuthModal}
      />
      <FederationAdminAuthModal
        isOpen={activeAuthModal === 'FEDERATION_ADMIN'}
        onClose={closeAuthModal}
      />
      <SuperAdminAuthModal
        isOpen={activeAuthModal === 'SUPER_ADMIN'}
        onClose={closeAuthModal}
      />
    </>
  );
};
