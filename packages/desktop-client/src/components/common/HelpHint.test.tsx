import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { HelpHint } from './HelpHint';

function mockHover(canHover: boolean) {
  vi.stubGlobal(
    'matchMedia',
    (query: string) =>
      ({
        matches: query === '(hover: hover)' ? canHover : false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: () => false,
      }) satisfies MediaQueryList,
  );
}

describe('HelpHint', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('opens the explanation in a popover when pressed (touch)', async () => {
    mockHover(false);
    const user = userEvent.setup();
    render(<HelpHint label="About spent">Total spent this month.</HelpHint>);

    expect(screen.queryByText('Total spent this month.')).toBeNull();

    await user.click(screen.getByRole('button', { name: 'About spent' }));

    expect(screen.getByText('Total spent this month.')).toBeVisible();
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('closes the popover with Escape', async () => {
    mockHover(false);
    const user = userEvent.setup();
    render(<HelpHint label="About spent">Total spent this month.</HelpHint>);

    await user.click(screen.getByRole('button', { name: 'About spent' }));
    await user.keyboard('{Escape}');

    expect(screen.queryByText('Total spent this month.')).toBeNull();
  });

  it('shows a tooltip on hover when the device can hover', () => {
    mockHover(true);
    vi.useFakeTimers();
    render(<HelpHint label="About spent">Total spent this month.</HelpHint>);

    const trigger = screen.getByRole('button', { name: 'About spent' });
    fireEvent.mouseEnter(trigger.parentElement as HTMLElement);
    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(screen.getByRole('tooltip')).toHaveTextContent(
      'Total spent this month.',
    );
  });
});
