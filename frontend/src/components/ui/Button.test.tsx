import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
    it('renders children correctly', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('applies variant classes', () => {
        render(<Button variant="destructive">Delete</Button>);
        expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    it('handles click events', () => {
        let clicked = false;
        render(<Button onClick={() => (clicked = true)}>Click</Button>);
        screen.getByText('Click').click();
        expect(clicked).toBe(true);
    });

    it('can be disabled', () => {
        render(<Button disabled>Disabled</Button>);
        expect(screen.getByText('Disabled')).toBeDisabled();
    });

    it('renders as child component with asChild prop', () => {
        render(
            <Button asChild>
                <a href="/test">Link Button</a>
            </Button>
        );
        expect(screen.getByText('Link Button')).toBeInTheDocument();
    });

    it('applies size variants', () => {
        render(<Button size="lg">Large Button</Button>);
        expect(screen.getByText('Large Button')).toBeInTheDocument();
    });
});
