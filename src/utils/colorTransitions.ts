

export type TransitionDirection = 'up' | 'down' | 'neutral';


export const getPriceTransitionClass = (direction: TransitionDirection): string => {
  switch (direction) {
    case 'up':
      return 'price-flash-up';
    case 'down':
      return 'price-flash-down';
    default:
      return '';
  }
};


export const getPriceBackgroundColor = (direction: TransitionDirection): string => {
  switch (direction) {
    case 'up':
      return 'bg-green-500/10';
    case 'down':
      return 'bg-red-500/10';
    default:
      return '';
  }
};


export const TRANSITION_CLASSES = 'transition-colors duration-300 ease-in-out';
