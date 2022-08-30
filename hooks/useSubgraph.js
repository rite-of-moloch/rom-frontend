import { useContext, useState, useEffect, useCallback } from "react";
import { AppContext } from "../context/AppContext";
import { CONTRACT_ADDRESSES, SUBGRAPH_URLS } from "../utils/constants";

const doFetch = async (_query, context) => {
    if (context.chainId && context.signerAddress) {
        console.log('Fetching subgraph data'/*, _query*/);

        const data = await fetch(SUBGRAPH_URLS[context.chainId], {
            method: 'POST',
            contentType: 'application/json',
            body: JSON.stringify({ query: _query })
        })

        const js = await data.json();

        if (data.status == 200) {
            return (js.data);
        }
    }
}

/**
 * @dev Returns initiate's subgraph data. If no cohort, returns null.
 * 
 * @param address   Optional. The address of the initiate. Leave null for contex.signerAddress
 * 
 * @param filtered  Optional. Whether to filter the data for current cohort. 
 */
export const useInitiate = (address, filtered = false) => {
    const context = useContext(AppContext);
    const [initate, setInitiate] = useState(null);

    const fetchInitiate = useCallback(async () => {
        const res = await doFetch(
            `{
                initiates(where: {address: "${address || context.signerAddress}"}) {
                    address
                    benefactor
                    tokenId
                    deadline
                    stake
                    joinedAt
                    claimed
                    sacrificed
                    cohort {
                        id
                        time
                        token
                        sharesAmount
                    }
                    claim {
                        amount
                    }
                    sacrifice {
                        amount
                        slasher
                    }
                }
            }`, context
        )
        if (res) {
            if (filtered) {
                const a = res.initiates.filter(init => init.cohort.id == CONTRACT_ADDRESSES[context.chainId].riteOfMolochAddress.toLowerCase());
                setInitiate(a[0]);
                //console.log('Initiate data', a[0])
            } else {
                setInitiate(res.initiates.length > 0 ? res.initiates : null);
            }
        }
    })

    useEffect(() => {
        fetchInitiate();
    }, [context.chainId, context.signerAddress])

    return (initate)
}

/**
 * @dev Returns cohort's subgraph data.
 * 
 * @param address   The address of the cohort. Leave null for RaidGuild S5 cohort
 */
export const useCohort = (address) => {
    const context = useContext(AppContext);
    const [cohort, setCohort] = useState(null);

    const fetchCohorts = useCallback(async () => {
        if (!address && !context.chainId) { return }
        const res = await doFetch(
            `{
                cohort(id: "${address ? address.toLowerCase() : CONTRACT_ADDRESSES[context.chainId].riteOfMolochAddress.toLowerCase()}") {
                    id
                    time
                    token
                    createdAt
                    sharesAmount
                    tokenAmount
                    treasury
                    implementation
                    initiates {
                        address
                        joinedAt
                        tokenId
                    }
                    criesForHelp {
                        sender {
                            address
                        }
                        message
                    }
                }
            }`, context
        )
        if (res) {
            console.log('Cohort data', res.cohort)
            setCohort(res.cohort);
        }
    })

    useEffect(() => {
        fetchCohorts();
    }, [context.chainId, context.signerAddress])

    return (cohort)
}