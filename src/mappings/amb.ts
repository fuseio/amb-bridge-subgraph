import { 
    UserRequestForAffirmation as UserRequestForAffirmationEvent, 
    UserRequestForSignature as UserRequestForSignatureEvent,
    RelayedMessage as RelayedMessageEvent,
    AffirmationCompleted as AffirmationCompletedEvent,
    CollectedSignatures as CollectedSignaturesEvent,
    RequiredBlockConfirmationChanged as RequiredBlockConfirmationChangedEvent
} from '../../generated/AMB/AMB';


import { 
    UserRequestForAffirmation, 
    UserRequestForSignature, 
    RelayedMessage, 
    AffirmationCompleted,
    CollectedSignature,
    RequiredBlockConfirmationChanged,
    Message
} from '../../generated/schema';
import { decodeSubmitSignatureCall, getIdFromMessage } from '../helper'


export function handleUserRequestForAffirmation(
    event: UserRequestForAffirmationEvent
): void {
    let msgId = event.params.messageId.toHexString();
    
    let request = UserRequestForAffirmation.load(msgId);
    if (request == null) {
        request = new UserRequestForAffirmation(msgId);
    }

    request.blockNo = event.block.number;
    request.txHash = event.transaction.hash;
    request.timestamp = event.block.timestamp;

    request.messageId = event.params.messageId;
    request.encodedData = event.params.encodedData;
    request.save();

    let message = Message.load(msgId);
    if (message == null) {
        message = new Message(msgId);
    }

    message.userRequestForAffirmation = msgId;
    message.txHash = event.transaction.hash.toHexString();
    message.save()
}

export function handleUserRequestForSignature(
    event: UserRequestForSignatureEvent
): void {
    let msgId = event.params.messageId.toHexString();

    let request = UserRequestForSignature.load(msgId)
    if (request == null) {
        request = new UserRequestForSignature(msgId);
    }

    request.blockNo = event.block.number;
    request.txHash = event.transaction.hash;
    request.timestamp = event.block.timestamp;

    request.messageId = event.params.messageId;
    request.encodedData = event.params.encodedData;
    request.save();

    let message = Message.load(msgId);
    if (message == null) {
        message = new Message(msgId);
    }

    message.userRequestForSignature = msgId;
    message.txHash = event.transaction.hash.toHexString();
    message.save()
}

export function handleRelayedMessage(event: RelayedMessageEvent): void {
    let msgId = event.params.messageId.toHexString();

    let relayedMessage = RelayedMessage.load(msgId);
    if (relayedMessage == null) {
        relayedMessage = new RelayedMessage(msgId);
    }

    relayedMessage.blockNo = event.block.number;
    relayedMessage.txHash = event.transaction.hash;
    relayedMessage.timestamp = event.block.timestamp;

    relayedMessage.sender = event.params.sender;
    relayedMessage.executor = event.params.executor;
    relayedMessage.messageId = event.params.messageId;
    relayedMessage.status = event.params.status;
    relayedMessage.save();

    let message = Message.load(msgId);
    if (message == null) {
        message = new Message(msgId);
    }

    message.relayedMessage = msgId;
    message.save()
}

export function handleAffirmationCompleted(event: AffirmationCompletedEvent): void {
    let msgId = event.params.messageId.toHexString();

    let affirmationCompleted = AffirmationCompleted.load(msgId);
    if (affirmationCompleted == null) {
        affirmationCompleted = new AffirmationCompleted(msgId);
    }

    affirmationCompleted.blockNo = event.block.number;
    affirmationCompleted.txHash = event.transaction.hash;
    affirmationCompleted.timestamp = event.block.timestamp;

    affirmationCompleted.sender = event.params.sender;
    affirmationCompleted.executor = event.params.executor;
    affirmationCompleted.messageId = event.params.messageId;
    affirmationCompleted.status = event.params.status;
    affirmationCompleted.save();
    
    let message = Message.load(msgId);
    if (message == null) {
        message = new Message(msgId);
    }

    message.affirmationCompleted = msgId;
    message.save()
}

export function handleCollectedSignatures(event: CollectedSignaturesEvent): void {
    let input = event.transaction.input.toHexString();
    let msg = decodeSubmitSignatureCall(input);
    let msgId = "0x" + getIdFromMessage(msg);

    let collectedSignatures = CollectedSignature.load(msgId);
    if (collectedSignatures == null) {
        collectedSignatures = new CollectedSignature(msgId);
    }

    collectedSignatures.blockNo = event.block.number;
    collectedSignatures.txHash = event.transaction.hash;
    collectedSignatures.timestamp = event.block.timestamp;

    collectedSignatures.authorityResponsibleForRelay = event.params.authorityResponsibleForRelay;
    collectedSignatures.messageHash = event.params.messageHash;
    collectedSignatures.numberOfCollectedSignatures = event.params.NumberOfCollectedSignatures;
    collectedSignatures.save();

    let message = Message.load(msgId);
    if (message == null) {
        message = new Message(msgId);
    }

    message.collectedSignature = msgId;
    message.save()
}

export function handleRequiredBlockConfirmationChanged(
    event: RequiredBlockConfirmationChangedEvent
): void {
    let txHash = event.transaction.hash;

    let requiredBlocks = RequiredBlockConfirmationChanged.load(txHash.toHexString());
    if (requiredBlocks == null) {
        requiredBlocks = new RequiredBlockConfirmationChanged(txHash.toHexString());
    }

    requiredBlocks.blockNo = event.block.number;

    requiredBlocks.requiredBlockConfirmations = event.params.requiredBlockConfirmations;
    requiredBlocks.save();
}
