export const IGP_ABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "messageId",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "uint32",
          "name": "destinationDomain",
          "type": "uint32"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "gasAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "payment",
          "type": "uint256"
        }
      ],
      "name": "GasPayment",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_messageId",
          "type": "bytes32"
        },
        {
          "internalType": "uint32",
          "name": "_destinationDomain",
          "type": "uint32"
        },
        {
          "internalType": "uint256",
          "name": "_gasAmount",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_refundAddress",
          "type": "address"
        }
      ],
      "name": "payForGas",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint32",
          "name": "_destinationDomain",
          "type": "uint32"
        },
        {
          "internalType": "uint256",
          "name": "_gasAmount",
          "type": "uint256"
        }
      ],
      "name": "quoteGasPayment",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
  