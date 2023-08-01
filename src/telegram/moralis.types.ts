// export interface ITransactionData {  
//     abi: Array<object>,
//     block: { number: string, hash: string, timestamp: string },
//     txs: Array<object>,
//     txsInternal: Array<object>,
//     logs: Array<object>,
//     chainId: string,
//     confirmed: true,
//     retries: 0,
//     tag: '',
//     streamId: '',
//     erc20Approvals: [],
//     erc20Transfers: [],
//     nftTokenApprovals: [],
//     nftApprovals: { ERC721: [], ERC1155: [] },
//     nftTransfers: [],
//     nativeBalances: []
  
//   }
export interface URI{
    value: string;
    id: BigInt;
  }