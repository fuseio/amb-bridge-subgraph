import {
    ValidatorAdded as ValidatorAddedEvent,
    ValidatorRemoved as ValidatorRemovedEvent,
    RequiredSignaturesChanged as RequiredSignaturesChangedEvent,
} from '../../generated/BridgeValidator/BridgeValidator'
import { RequiredSignaturesChanged, ValidatorAdded, ValidatorRemoved } from '../../generated/schema';

export function handleValidatorAdded(
    event: ValidatorAddedEvent
): void {
    let txHash = event.transaction.hash;

    let validatorAdded = ValidatorAdded.load(txHash.toHexString());
    if (validatorAdded == null) {
        validatorAdded = new ValidatorAdded(txHash.toHexString());
    }

    validatorAdded.blockNo = event.block.number;

    validatorAdded.validator = event.params.validator;
    validatorAdded.save();
}

export function handleValidatorRemoved(
    event: ValidatorRemovedEvent
): void {
    let txHash = event.transaction.hash;

    let validatorRemoved = ValidatorRemoved.load(txHash.toHexString());
    if (validatorRemoved == null) {
        validatorRemoved = new ValidatorRemoved(txHash.toHexString());
    }

    validatorRemoved.blockNo = event.block.number;

    validatorRemoved.validator = event.params.validator;
    validatorRemoved.save();
}

export function handleRequiredSignaturesChanged(
    event: RequiredSignaturesChangedEvent
): void {
    let txHash = event.transaction.hash;

    let requiredSignatures = RequiredSignaturesChanged.load(txHash.toHexString());
    if (requiredSignatures == null) {
        requiredSignatures = new RequiredSignaturesChanged(txHash.toHexString());
    }

    requiredSignatures.blockNo = event.block.number;

    requiredSignatures.requiredSignatures = event.params.requiredSignatures;
    requiredSignatures.save();
}
