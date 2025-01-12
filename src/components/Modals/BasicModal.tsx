import React from 'react';
import { useModal } from '../../context/ModalContext';

const BasicModal: React.FC = () => {
  const { openModal, hideModal, modalChildren } = useModal();
  return (
    <>
      <div
        className={`fixed top-0 left-0  w-full h-full overflow-x-hidden overflow-y-auto  ease-linear  z-50 outline-0 ${
          openModal ? 'block bg-black bg-opacity-50 ' : 'hidden opacity-0'
        }`}
      >
        <div
          className={`relative w-auto m-2 transition-transform duration-300 ease-out pointer-events-none sm:m-7 sm:max-w-2xl sm:mx-auto lg:mt-20 ${
            openModal ? 'transform-none' : '-translate-y-12'
          }`}
        >
          <div className="relative flex flex-col w-full bg-white border border-solid pointer-events-auto dark:bg-gray-950 bg-clip-padding border-black/20 rounded-xl outline-0 min-h-10">
            <button
              onClick={hideModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Close"
            >
              <i className="fa fa-times" aria-hidden="true"></i>
            </button>
            <div>{modalChildren}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BasicModal;
