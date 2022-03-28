import React, { useCallback, useEffect, useState } from "react";
import Section from "../components/layouts/Section";
import SiteLogo from "../components/SiteLogo";
import ConnectWalletButton from "../components/Buttons/ConnectWalletButton";
import useActiveWeb3React from "../hooks/useActiveWeb3React";
import Button from "../components/Buttons";
import {
  checkTokenAllowance,
  claimBusd,
  getTokenBalance,
} from "../utils/calls";
import useToast from "../hooks/useToast";
import { useAppContext } from "../hooks/useAppContext";
import { getGffAddress, getGffContractAddress } from "../utils/addressHelpers";
import useApproveToken from "../hooks/useApproveToken";
import { getGffTokenContract } from "../utils/contractHelpers";
import { StaticImage } from "gatsby-plugin-image";
import gif1 from "../images/garfield-family-gif1.gif";
import gif2 from "../images/garfield-family-gif2.gif";

const IndexPage = () => {
  const [claiming, setClaiming] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [requestedApproval, setRequestedApproval] = useState(false);

  const {
    wallet: { balance },
    triggerFetchTokens,
  } = useAppContext();
  const { active, library, account } = useActiveWeb3React();
  const { toastError, toastSuccess } = useToast();
  const { onApprove } = useApproveToken(
    getGffTokenContract(library?.getSigner()),
    getGffContractAddress()
  );

  // Check user Gff allowance
  useEffect(() => {
    (async () => {
      if (account != null && active && library != null) {
        const allowance = await checkTokenAllowance(
          getGffContractAddress(),
          account,
          getGffAddress(),
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
  }, [onApprove, account, library]);

  const getGffBal = useCallback(async () => {
    if (account) {
      const result = await getTokenBalance(
        getGffAddress(),
        account,
        18
      );
      return result;
    } else {
      return "0";
    }
  }, [account]);

  const handleClaimBusd = useCallback(async () => {
    if (library) {
      setClaiming(true);
      try {
        const gffBal = await getGffBal();
        await claimBusd(gffBal, library.getSigner());
        toastSuccess("Success", "BUSD reclaimed to your wallet");
        triggerFetchTokens();
      } catch (err) {
        console.error(err);
        toastError(
          "Error",
          `Something went wrong while trying to perform the transaction.
          Confirm the transaction, have enough BUSD in your wallet and make
          sure you are paying enough gas!`
        );
      } finally {
        setClaiming(false);
      }
    }
  }, [library, getGffBal]);

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
            <div className="space-y-3 mb-3 text-center">
              <p>
                Hey Kittens, $GFF launch is cancelled because the funds raised
                during private sale ain't enough to fund the extensive marketing
                needed to take $GFF holders to the moon 🌒. All private sale can
                claim back the spent BUSD below.
              </p>
              <p>Thanks for your understanding.</p>
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
                <div className="max-w-sm w-full">
                  <Button
                    onClick={handleClaimBusd}
                    className="disabled:!opacity-40 disabled:cursor-not-allowed border-none !shadow-none !block
                      mx-auto uppercase text-base"
                    disabled={claiming}
                  >
                    Claim Back Spent BUSD
                  </Button>
                </div>
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
      </Section>
    </main>
  );
};

export default IndexPage;
