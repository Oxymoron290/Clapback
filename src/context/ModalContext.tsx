import React, { createContext, useState, useContext } from 'react';

interface ModalContextType {
  openModal: boolean;
  modalChildren: React.ReactNode;
  showModal: (children: React.ReactNode) => void;
  hideModal: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [openModal, setOpenModal] = useState(false);
  const [modalChildren, setModalChildren] = useState<React.ReactNode>(<></>);

  const showModal = (children: React.ReactNode) => {
    setModalChildren(children);
    setOpenModal(true);
  };

  const hideModal = () => {
    setOpenModal(false);
    setModalChildren(<></>);
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal, modalChildren, openModal }}>
      {children}
    </ModalContext.Provider>
  );
};


export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if(!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
