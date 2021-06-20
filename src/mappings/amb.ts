import { 
    UserRequestForAffirmation as UserRequestForAffirmationEvent, 
    UserRequestForSignature as UserRequestForSignatureEvent,
    RelayedMessage as RelayedMessageEvent,
    AffirmationCompleted as AffirmationCompletedEvent,
    CollectedSignatures as CollectedSignaturesEvent,
    RequiredBlockConfirmationChanged as RequiredBlockConfirmationChangedEvent
} from '../../generated/AMB/AMB'

import { 
    UserRequestForAffirmation, 
    UserRequestForSignature, 
    RelayedMessage, 
    AffirmationCompleted,
    CollectedSignature,
    RequiredBlockConfirmationChanged
} from '../../generated/schema'

export function handleUserRequestForAffirmation(
    event: UserRequestForAffirmationEvent
): void {
    let txHash = event.transaction.hash;
    
    let request = UserRequestForAffirmation.load(txHash.toHexString());
    if (request == null) {
        request = new UserRequestForAffirmation(txHash.toHexString());
    }

    request.messageId = event.params.messageId;
    request.encodedData = event.params.encodedData;
    request.save();
}

export function handleUserRequestForSignature(
    event: UserRequestForSignatureEvent
): void {
    let txHash = event.transaction.hash;

    let request = UserRequestForSignature.load(txHash.toHexString())
    if (request == null) {
        request = new UserRequestForSignature(txHash.toHexString());
    }

    request.messageId = event.params.messageId;
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
    let txHash = event.transaction.hash;

    let collectedSignatures = CollectedSignature.load(txHash.toHexString());
    if (collectedSignatures == null) {
        collectedSignatures = new CollectedSignature(txHash.toHexString());
    }

    collectedSignatures.authorityResponsibleForRelay = event.params.authorityResponsibleForRelay;
    collectedSignatures.messageHash = event.params.messageHash;
    collectedSignatures.numberOfCollectedSignatures = event.params.NumberOfCollectedSignatures;
    collectedSignatures.save();
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
