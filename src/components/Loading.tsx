interface LoadingProps {
    error?: string;
}

export default function Loading({ error }: LoadingProps) {
    return (
        <div id="loading">
            <div>
            <img src='/src/img/routinator_logo_white.svg' alt='Routinator logo' />
            <br />
            <p>{error || "Something went wrong"}</p>
            </div>
        </div>
    );
}
