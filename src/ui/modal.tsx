export interface Modal_P {
  state: boolean;
  children: React.ReactNode;
}

export const Modal: React.FC<Modal_P> = ({ state, children }: Modal_P) => {
  if (!state) {
    return <></>;
  }

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-50 backdrop-blur-sm bg-slate-800/40 flex flex-col justify-center">
      {children}
    </div>
  );
};
