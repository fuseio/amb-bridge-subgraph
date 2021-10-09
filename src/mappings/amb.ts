import { Bytes, crypto, BigInt} from '@graphprotocol/graph-ts';
import { 
    UserRequestForAffirmation as UserRequestForAffirmationEvent, 
    UserRequestForSignature as UserRequestForSignatureEvent,
    RelayedMessage as RelayedMessageEvent,
    AffirmationCompleted as AffirmationCompletedEvent,
    CollectedSignatures as CollectedSignaturesEvent,
    RequiredBlockConfirmationChanged as RequiredBlockConfirmationChangedEvent,
    AMB
} from '../../generated/AMB/AMB'

import { 
    UserRequestForAffirmation, 
    UserRequestForSignature, 
    RelayedMessage, 
    AffirmationCompleted,
    CollectedSignature,
    RequiredBlockConfirmationChanged,
    Message
} from '../../generated/schema'

export function handleUserRequestForAffirmation(
    event: UserRequestForAffirmationEvent
): void {
    let txHash = event.transaction.hash;
    
    let request = UserRequestForAffirmation.load(txHash.toHexString());
    if (request == null) {
        request = new UserRequestForAffirmation(txHash.toHexString());
    }

    let message = new Message(
        crypto.keccak256(event.params.encodedData).toHexString()
    );
    message.msgId = event.params.messageId;
    message.txHash = txHash;
    message.save();

    request.messageId = event.params.messageId;
    request.encodedData = event.params.encodedData;
    request.save();
}

export function handleUserRequestForSignature(
    event: UserRequestForSignatureEvent
): void {
    let txHash = event.transaction.hash;

    let request = UserRequestForSignature.load(txHash.toHexString());
    if (request == null) {
        request = new UserRequestForSignature(txHash.toHexString());
    };

    let message = new Message(
        crypto.keccak256(event.params.encodedData).toHexString()
    );
    message.msgId = event.params.messageId;
    message.txHash = txHash;
    message.save();

    request.messageId = event.params.messageId;
    request.message = message.id;
    request.encodedData = event.params.encodedData;
    request.save();
}

export function handleRelayedMessage(event: RelayedMessageEvent): void {
    let txHash = event.transaction.hash;

    let relayedMessage = RelayedMessage.load(txHash.toHexString());
    if (relayedMessage == null) {
        relayedMessage = new RelayedMessage(txHash.toHexString());
    }

    relayedMessage.sender = event.params.sender;
    relayedMessage.executor = event.params.executor;
    relayedMessage.messageId = event.params.messageId;
    relayedMessage.status = event.params.status;
    relayedMessage.save();
}

export function handleAffirmationCompleted(event: AffirmationCompletedEvent): void {
    let txHash = event.transaction.hash;

    let affirmationCompleted = AffirmationCompleted.load(txHash.toHexString());
    if (affirmationCompleted == null) {
        affirmationCompleted = new AffirmationCompleted(txHash.toHexString());
    }

    affirmationCompleted.sender = event.params.sender;
    affirmationCompleted.executor = event.params.executor;
    affirmationCompleted.messageId = event.params.messageId;
    affirmationCompleted.status = event.params.status;
    affirmationCompleted.save();
}

export function handleCollectedSignatures(event: CollectedSignaturesEvent): void {
    let ambInstance = AMB.bind(event.address);
    let message = ambInstance.try_message(event.params.messageHash);
    if (!message.reverted) {
        let msg = Message.load(crypto.keccak256(message.value).toHexString());
        if (msg != null) {
            msg.msgData = message.value;
            msg.msgHash = event.params.messageHash;
            let signatures = new Array<Bytes>();
            for (let i = BigInt.fromI32(0); i.lt(event.params.NumberOfCollectedSignatures); i = i.plus(BigInt.fromI32(1))) {
                let signature = ambInstance.try_signature(event.params.messageHash, i);
                if (!signature.reverted) {
                    signatures.push(signature.value)
                }
            }
            msg.signatures = signatures;
            msg.save()
        }
    }
}

export function handleRequiredBlockConfirmationChanged(
    event: RequiredBlockConfirmationChangedEvent
): void {
    let txHash = event.transaction.hash;

    let requiredBlocks = RequiredBlockConfirmationChanged.load(txHash.toHexString());
    if (requiredBlocks == null) {
        requiredBlocks = new RequiredBlockConfirmationChanged(txHash.toHexString());
    }

    requiredBlocks.requiredBlockConfirmations = event.params.requiredBlockConfirmations;
    requiredBlocks.save();
}
