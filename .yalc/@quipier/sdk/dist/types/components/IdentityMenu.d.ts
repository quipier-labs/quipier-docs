interface Props {
    nickname: string;
    tokenId: string;
    /** Passport management page URL (passportAppOrigin + "/me"). */
    manageUrl: string;
    onDisconnect: () => void;
    onClose: () => void;
}
export declare function IdentityMenu({ nickname, tokenId, manageUrl, onDisconnect, onClose }: Props): import("preact").JSX.Element;
export {};
//# sourceMappingURL=IdentityMenu.d.ts.map