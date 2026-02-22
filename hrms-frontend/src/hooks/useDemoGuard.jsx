import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import DemoRestrictionModal from '../components/common/DemoRestrictionModal';

export function useDemoGuard() {
    const { user } = useAuth();
    const [showDemoModal, setShowDemoModal] = useState(false);

    // Consider an account type DEMO or explicitly set as a demo user
    const isDemoUser = user?.accountType === "DEMO" || user?.email?.includes("demo");

    const guardWriteAction = useCallback((actionFn) => {
        return (...args) => {
            if (isDemoUser) {
                setShowDemoModal(true);
                return;
            }
            return actionFn(...args);
        };
    }, [isDemoUser]);

    const DemoModal = useCallback(() => (
        <DemoRestrictionModal
            isOpen={showDemoModal}
            onClose={() => setShowDemoModal(false)}
        />
    ), [showDemoModal]);

    return { isDemoUser, guardWriteAction, DemoModal };
}
