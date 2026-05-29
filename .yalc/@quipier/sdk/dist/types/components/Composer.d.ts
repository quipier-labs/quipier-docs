interface Props {
    session: {
        tokenId: string;
        nickname: string;
    } | null;
    onSubmit: (content: string) => Promise<void>;
    onConnectRequest: () => void;
    onDisconnect: () => void;
    /** Passport management page URL, passed through to the identity menu. */
    manageUrl: string;
    placeholder?: string;
}
export declare function Composer({ session, onSubmit, onConnectRequest, onDisconnect, manageUrl, placeholder, }: Props): import("preact").JSX.Element;
export {};
//# sourceMappingURL=Composer.d.ts.map