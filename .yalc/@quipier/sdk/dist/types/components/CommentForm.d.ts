interface Props {
    disabled?: boolean;
    placeholder?: string;
    submitLabel?: string;
    initialValue?: string;
    onSubmit: (content: string) => Promise<void>;
    onCancel?: () => void;
    autoFocus?: boolean;
}
export declare function CommentForm({ disabled, placeholder, submitLabel, initialValue, onSubmit, onCancel, autoFocus, }: Props): import("preact").JSX.Element;
export {};
//# sourceMappingURL=CommentForm.d.ts.map