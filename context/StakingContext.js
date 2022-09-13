import React, { useState, createContext } from "react";

const StakingContext = createContext();

function StakingContextProvider({ children }) {
  const [minimumStake, setMinimumStake] = useState(0);
  const [raidBalance, setRaidBalance] = useState(0);
  const [allowance, setAllowance] = useState(0);
  const [displaySponsorCohort, setDisplaySponsorCohort] = useState(false);
  const [checkboxDisplay, setCheckboxDisplay] = useState(false);
  const [sponsorCohortTextDisplay, setSponsorCohortTextDisplay] =
    useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [cohortAddress, setCohortAddress] = useState("");
  const [isApproveTxPending, setIsApproveTxPending] = useState(false);
  const [isStakeTxPending, setIsStakeTxPending] = useState(false);

  const handleIsChecked = () => {
    setIsChecked((isChecked) => !isChecked);
  };

  const handleCohortAddress = (e) => {
    setCohortAddress(e.target.value);
  };

  const handleSponsorCohort = () => {
    setDisplaySponsorCohort((displaySponsorCohort) => !displaySponsorCohort);
  };

  const value = {
    minimumStake,
    setMinimumStake,
    raidBalance,
    setRaidBalance,
    allowance,
    setAllowance,
    displaySponsorCohort,
    setDisplaySponsorCohort,
    checkboxDisplay,
    setCheckboxDisplay,
    sponsorCohortTextDisplay,
    setSponsorCohortTextDisplay,
    isChecked,
    setIsChecked,
    setHandleIsChecked,
    cohortAddress,
    setCohortAddress,
    setHandleCohortAddress,
    isApproveTxPending,
    setIsApproveTxPending,
    isStakeTxPending,
    setIsStakeTxPending,
    handleIsChecked,
    handleCohortAddress,
    handleSponsorCohort,
  };

  return (
    <StakingContext.Provider value={value}>{children}</StakingContext.Provider>
  );
}

export { StakingContext, StakingContextProvider };
