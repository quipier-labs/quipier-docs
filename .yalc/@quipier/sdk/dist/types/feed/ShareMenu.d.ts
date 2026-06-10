interface Props {
    url: string;
    title?: string;
    text?: string;
}
/** Share affordance for a post: a small menu with "링크 복사" (always) and
 *  "공유하기" (native share sheet, only where the Web Share API exists). The
 *  copy option means a link is one click away even when the OS sheet buries it. */
export declare function ShareMenu({ url, title, text }: Props): import("preact").JSX.Element;
export {};
//# sourceMappingURL=ShareMenu.d.ts.map