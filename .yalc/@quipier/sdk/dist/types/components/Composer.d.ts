interface Props {
    session: {
        tokenId: string;
        nickname: string;
    } | null;
    onSubmit: (content: string, image?: string | null) => Promise<void>;
    onConnectRequest: () => void;
    onDisconnect: () => void;
    /** Passport management page URL, passed through to the identity menu. */
    manageUrl: string;
    placeholder?: string;
    /** Show an image-attach button (feed posts). Default false. */
    allowImage?: boolean;
}
export declare function Composer({ session, onSubmit, onConnectRequest, onDisconnect, manageUrl, placeholder, allowImage, }: Props): import("preact").JSX.Element;
export {};
//# sourceMappingURL=Composer.d.ts.map