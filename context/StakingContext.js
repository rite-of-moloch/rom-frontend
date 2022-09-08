import React, { Component, createContext } from "react";
import { utils } from "ethers";

export const StakingFlowContext = createContext();

class StakingFlowContextProvider extends Component {
  state = {
    minimumStake: 0,
    raidBalance: 0,
    allowance: 0,
    displaySponsorCohort: false,
    checkboxDisplay: false,
    sponsorCohortTextDisplay: null,
    isChecked: false,
    handleIsChecked: null,
    cohortAddress: "",
    handleCohortAddress: null,
    isApproveTxPending: false,
    isStakeTxPending: false,
  };

  render() {
    return (
      <StakingFlowContext.Provider
        value={{
          ...this.state,
        }}
      >
        {this.props.children}
      </StakingFlowContext.Provider>
    );
  }
}

export default StakingFlowContextProvider;
