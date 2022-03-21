import React from "react";
import { useAppContext } from "../../hooks/useAppContext";
import useWallet from "../../hooks/useWallet";
import cls from "classnames";
import Button from "./";

interface ConnectWalletButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {}

const ConnectWalletButton = ({
  className,
  ...props
}: ConnectWalletButtonProps) => {
  const {
    wallet: { active, error, retry, isConnecting },
  } = useAppContext();
  const { onPresentConnectModal } = useWallet();

  const openModal = () => {
    onPresentConnectModal();
  };

  return (
    <React.Fragment>
      {!active && !error && (
        <Button
          disabled={isConnecting}
          onClick={openModal}
          className={cls(
            "block mx-auto transition-all duration-300 mt-3",
            {
              "cursor-not-allowed hover:text-opacity-80": isConnecting,
            },
            className
          )}
          {...props}
        >
          {isConnecting ? "..." : "Connect wallet"}
        </Button>
      )}
      {!active && error && (
        <button
          className="transition-all duration-300 bg-red-600 hover:bg-white ring-red-600 ring-1
            mx-auto text-white hover:text-red-600 font-medium uppercase p-2 flex justify-center
            items-center"
          onClick={retry}
        >
          Retry to Connect
        </button>
      )}
    </React.Fragment>
  );
};

export default ConnectWalletButton;
