import {create} from "zustand";

interface TermsStore {
    acceptedTerms: boolean;
    toggleTerms: () => void;
    acceptTerms: () => void;
}

const useTermsStore = create<TermsStore>((set) => ({
    acceptedTerms: false,
    toggleTerms: () => set((state) => ({acceptedTerms: !state.acceptedTerms})),
    acceptTerms: () => set({acceptedTerms: true}),
}));

export default useTermsStore;