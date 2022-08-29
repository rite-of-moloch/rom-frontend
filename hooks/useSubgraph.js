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
                    cohort {
                        id
                        time
                        token
                        sharesAmount
                    }
                }
            }`, context
        )
        if (res) {
            if(filtered) {
                const a = res.initiates.filter(init => init.cohort.id == CONTRACT_ADDRESSES[context.chainId].riteOfMolochAddress.toLowerCase());
                setInitiate(a[0]);
            }else{
                setInitiate(res.initiates.length > 0 ? res.initiates : null);
            }
        }
    })

    useEffect(() => {
        fetchInitiate();
    }, [context.chainId, context.signerAddress])

    return (initate)
}

//Optional parameters
export const useCohort = (address) => {
    const context = useContext(AppContext);
    const [cohort, setCohort] = useState(null);

    const fetchCohorts = useCallback(async () => {
        if(!address && !context.chainId){return}
        const res = await doFetch(
            `{
                cohort(id: "${address ? address.toLowerCase() : CONTRACT_ADDRESSES[context.chainId].riteOfMolochAddress.toLowerCase()}") {
                    id
                    time
                    token
                    initiates {
                        address
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
            setCohort(res.cohort);
        }
    })

    useEffect(() => {
        fetchCohorts();
    }, [context.chainId, context.signerAddress])

    return (cohort)
}