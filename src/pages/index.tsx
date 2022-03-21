import React, { useCallback, useEffect, useState } from "react";
import Section from "../components/layouts/Section";
import SiteLogo from "../components/SiteLogo";
import ConnectWalletButton from "../components/Buttons/ConnectWalletButton";
import useActiveWeb3React from "../hooks/useActiveWeb3React";
import cls from "classnames";
import Button from "../components/Buttons";
import { checkTokenAllowance, sellGff } from "../utils/calls";
import useToast from "../hooks/useToast";
import { useAppContext } from "../hooks/useAppContext";
import { getBusdAddress, getGffAddress, getGffContractAddress } from "../utils/addressHelpers";
import useApproveToken from "../hooks/useApproveToken";
import { getBusdContract, getGffTokenContract } from "../utils/contractHelpers";
import { StaticImage } from "gatsby-plugin-image";
import gif1 from "../images/garfield-family-gif1.gif";
import gif2 from "../images/garfield-family-gif2.gif";
import CountDowntimer from "../components/CountDowntimer";

const IndexPage = () => {
  const [amountToPay, setAmountToPay] = useState("");
  const [selling, setSelling] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isApproved, setIsApproved] = useState(false);
  const [requestedApproval, setRequestedApproval] = useState(false);

  const {
    wallet: { balance },
    triggerFetchTokens,
  } = useAppContext();
  const { active, library, account } = useActiveWeb3React();
  const { toastError, toastSuccess } = useToast();
  const { onApprove } = useApproveToken(
    getBusdContract(library?.getSigner()),
    getGffContractAddress()
  );

  // Check user Gff allowance
  useEffect(() => {
    (async () => {
      if (account != null && active && library != null) {
        const allowance = await checkTokenAllowance(
          getGffContractAddress(),
          account,
          getBusdAddress(),
          library.getSigner()
        );
        if (allowance.isGreaterThan(0)) {
          setIsApproved(true);
        } else {
          setIsApproved(false);
        }
      } else {
        setIsApproved(false);
      }
    })();
  }, [account, active, library]);

  const handleApprove = useCallback(async () => {
    if (account && library) {
      try {
        setRequestedApproval(true);
        await onApprove();
        setIsApproved(true);
      } catch (e) {
        console.error(e);
        toastError(
          "Error",
          "Please try again. Confirm the transaction and make sure you are paying enough gas!"
        );
        setIsApproved(false);
      } finally {
        setRequestedApproval(false);
      }
    }
  }, [onApprove, account, library, toastError]);

  const handleInputChange: React.FormEventHandler<HTMLInputElement> =
    useCallback(
      async (e) => {
        const val = e.currentTarget.value.replace(/,/g, ".");
        const pattern = /^[0-9]*[.,]?[0-9]{0,18}$/g;
        if (!pattern.test(val)) return;

        const amount = Number.parseFloat(val);
        const bal = Number.parseFloat(balance);

        if (amount > bal) {
          setErrorMsg("Insufficient funds in your wallet");
        } else if (amount < 50) {
          setErrorMsg("Min Purchase value is 50");
        } else if (amount > 1000) {
          setErrorMsg("Max purchase value is 1000");
        } else {
          setErrorMsg("");
        }
        setAmountToPay(val);
      },
      [balance]
    );

  const handleSellIncome = useCallback(async () => {
    if (library) {
      setSelling(true);
      try {
        await sellGff(amountToPay, library.getSigner());
        toastSuccess("Success", "Your income has been sold to lambo");
        triggerFetchTokens();
      } catch (err) {
        // console.error(err);
        toastError(
          "Error",
          `Something went wrong while trying to perform the transaction.
          Confirm the transaction, have enough BUSD in your wallet and make
          sure you are paying enough gas and!`
        );
      } finally {
        setSelling(false);
      }
    }
  }, [library]);

  return (
    <main className="min-h-screen w-full grid">
      <StaticImage
        src="../images/background.gif"
        layout="fullWidth"
        placeholder="blurred"
        alt=""
        aria-hidden={true}
        className="h-full"
        quality={100}
        style={{
          gridArea: "1/1",
        }}
      />
      <Section containerClass="grid relative place-items-center grid-area-1 pb-5">
        <SiteLogo text="Garfield Family" />
        <div className="flex flex-col items-center md:flex-row md:justify-between md:space-x-5">
          <div className="rounded-full bg-gray-50 p-1 w-52 h-52 min-w-[208px] mx-auto">
            <img
              src={gif1}
              alt="Garfield Family Classic cat gif"
              className="rounded-full w-full h-full"
            />
          </div>
          <div className="bg-[#001C44]/70 rounded-3xl p-5 md:p-10 my-5 max-w-2xl text-white">
            <div className="space-y-3">
              <p>
                The first Cat themed NFT collection in the world has been
                freshly minted by the prince of cats - Garfield
              </p>
              <p>
                Garfield Family creates a digital cat pet world where players
                can raise and breed varieties of cute cats and fight shoulder to
                shoulder in the adventure world with their cats.
              </p>
              <p>
                Ownership is totally decided by players, allowing players to
                seamlessly sell and trade their game NFTs into GFF and also earn
                by playing games.
              </p>
            </div>
            <div>
              <h2>Garfield Family Token Details</h2>
              <ul className="text-sm">
                <li>Network: Binance Smart Chain (BSC)</li>
                <li>Name: Garfield Family Games</li>
                <li>Symbol: GFF</li>
                <li>Decimal: 18</li>
                <li>Address: 0x5BC1dE85Fb09eDEefD54869cd8cFB20B30574CE8</li>
              </ul>
            </div>
            <div className="space-y-3 my-5 text-sm text-center">
              <div className="flex flex-col md:flex-row justify-center w-full md:space-x-5">
                <p>Presale Price: 1 GFF = $0.4</p>
                <p>Listing Price: 1 GFF = $0.5</p>
              </div>
              <div className="flex flex-col md:flex-row justify-center w-full md:space-x-5">
                <p className="text-[#F9851B]">Min. Purchase: $50</p>
                <p className="text-[#97F51F]">Max. Purchase: $1000</p>
              </div>
            </div>
            <ConnectWalletButton />
            {active && !isApproved && (
              <Button
                onClick={handleApprove}
                className="disabled:!opacity-40 disabled:cursor-not-allowed border-none !shadow-none !block
              mx-auto uppercase text-base"
                disabled={requestedApproval}
              >
                Approve Contract
              </Button>
            )}
            {active && isApproved && (
              <div className="flex flex-col items-center w-full space-y-3">
                <div className="bg-[#2575E7]/40 p-0.5 text-center text-sm w-full max-w-md">
                  Your BUSD Balance: {balance}
                </div>
                <TextInput
                  value={amountToPay}
                  onChangeHandler={handleInputChange}
                  onSubmit={handleSellIncome}
                  errorMsg={errorMsg}
                  isDisabled={
                    selling ||
                    errorMsg.length > 0 ||
                    Number.isNaN(Number.parseFloat(amountToPay))
                  }
                />
              </div>
            )}
          </div>
          <div className="rounded-full bg-gray-50 p-1 w-52 h-52 min-w-[208px] mx-auto">
            <img
              src={gif2}
              alt="Garfield Family Classic cat gif"
              className="rounded-full w-full h-full"
            />
          </div>
        </div>
        <footer className="text-center text-white mt-5 space-y-3">
          <a
            className="underline hover:text-sky-400"
            href="https://t.me/GarfieldFamily"
          >
            Join the Telegram Community
          </a>
          <div className="text-xs">
            copyright &copy; Garfield Family - {new Date().getFullYear()}
          </div>
        </footer>
        <div
          className="text-center flex justify-center flex-wrap items-center py-2 text-white font-medium
          bg-[#2575E7] mt-3 w-full"
        >
          <div>
            <span className="font-light">Sale Ends in: </span>
            <CountDowntimer />
          </div>
        </div>
      </Section>
    </main>
  );
};

interface TextInputProps {
  errorMsg: string;
  onChangeHandler: (e: React.FormEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  value: string;
  isDisabled: boolean;
}

const TextInput = ({
  onChangeHandler,
  onSubmit,
  errorMsg,
  value,
  isDisabled,
}: TextInputProps) => {
  const hasError = errorMsg.length > 0;
  const val = Number.parseFloat(value);
  return (
    <div className="max-w-sm w-full space-y-2">
      <div className="px-4 rounded-full py-0.5 bg-[#2575E7]">
        <input
          type="text"
          className={cls(
            "placeholder-gray-400 outline-none border-none ring-2 ring-transparent font-normal",
            "focus:ring-blue-300 focus-within:ring-blue-300 transition-all duration-200",
            "text-gray-700 px-3 py-2 bg-gray-100 disabled:opacity-70 disabled:cursor-not-allowed",
            "block w-full rounded-full",
            {
              ["focus:ring-transparent focus-within:ring-transparent text-red-400 bg-red-50"]:
                hasError,
            }
          )}
          placeholder="Amount of BUSD to spend"
          value={value}
          onChange={onChangeHandler}
        />
      </div>
      <div
        className={cls("text-center text-sm", { ["text-red-400"]: hasError })}
      >
        {hasError
          ? errorMsg
          : "You will recieve: " + `${!Number.isNaN(val) ? val / 0.4 : 0} GFF`}
      </div>
      <Button
        onClick={onSubmit}
        className="disabled:!opacity-40 disabled:cursor-not-allowed border-none !shadow-none !block
          mx-auto uppercase text-base"
        disabled={isDisabled}
      >
        Buy GFF
      </Button>
    </div>
  );
};
export default IndexPage;
