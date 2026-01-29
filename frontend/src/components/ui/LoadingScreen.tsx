// Loading Screen Component Placeholder
// Implement your loading screen here

interface LoadingScreenProps {
    message?: string;
}

export function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
    return (
        <div>
            <p>{message}</p>
        </div>
    );
}
