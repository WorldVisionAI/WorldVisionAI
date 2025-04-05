export const IHypERC20_ABI = [
	{
		name: "transferRemote",
		inputs: [
			{
				internalType: "uint32",
				name: "_destinationDomain",
				type: "uint32",
			},
			{
				internalType: "bytes32",
				name: "_recipient",
				type: "bytes32",
			},
			{
				internalType: "uint256",
				name: "_amount",
				type: "uint256",
			},
		],
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32",
			},
		],
		stateMutability: "payable",
		type: "function",
	},
];
