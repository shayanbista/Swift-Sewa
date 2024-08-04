declare global {
  export interface Window {
    previousPage: () => void;
    nextPage: () => void;
    gotoPage: (page: number) => void;
  }
}

export {};
