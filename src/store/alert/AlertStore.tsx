import {create} from "zustand";

interface AlertStore {
    displayAlert: boolean;
    alertTitle: string;
    openAlert: (alertTitle: string) => void;
    closeAlert: () => void;
}

const useAlertStore = create<AlertStore>((set) => ({
    displayAlert: false,
    alertTitle: '',
    openAlert: (alertTitle) =>
        set({
            displayAlert: true,
            alertTitle: alertTitle,
        }),
    closeAlert: () => set({displayAlert: false}),
}));

export default useAlertStore;