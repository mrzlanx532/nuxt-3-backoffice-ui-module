// @ts-nocheck
export const maskDate = (e: Event, ref, delimiter = '.') => {
    const key = e.key

    if (
        key === 'Esc' ||
        key.match(/F[1-9]|F1[0-2]/) ||
        key === 'Tab' ||
        key === 'ArrowLeft' ||
        key === 'ArrowRight' ||
        (e.ctrlKey === true && key === 'a')
    ) {
        return
    }

    e.preventDefault()

    if (key === 'Backspace') {
        handleBackspace(e, ref, delimiter)
    }

    if (key === ' ' || key === 'Spacebar') {
        return
    }

    if (Number(key) >= 0 && Number(key) <= 9) {
        handleNumbers(e, ref, delimiter)
    }
}

export const maskDatetime = (e: Event, ref, delimiterDate = '.', delimiterTime = ':') => {
    const key = e.key

    if (
        key === 'Esc' ||
        key.match(/F[1-9]|F1[0-2]/) ||
        key === 'Tab' ||
        key === 'ArrowLeft' ||
        key === 'ArrowRight' ||
        (e.ctrlKey === true && key === 'a')
    ) {
        return
    }

    e.preventDefault()

    if (key === 'Backspace') {
        handleBackspaceDatetime(e, ref, delimiterDate)
    }

    if (key === ' ' || key === 'Spacebar') {
        return
    }

    if (Number(key) >= 0 && Number(key) <= 9) {
        handleNumbersDateTime(e, ref, delimiterDate)
    }
}

const handleBackspace = (e, ref, delimiter) => {
    if (e.target.selectionStart !== e.target.selectionEnd) {
        ref.value = ref.value.substring(0, e.target.selectionStart) + ref.value.substring(e.target.selectionEnd)

        return
    }

    if (ref.value !== null && ref.value[ref.value.length - 2] === delimiter) {
        ref.value = ref.value.slice(0, -2)
        return
    }

    ref.value = ref.value === null ? ref.value : ref.value.slice(0, -1)
}

const handleBackspaceDatetime = (e, ref, delimiter) => {
    if (e.target.selectionStart !== e.target.selectionEnd) {
        ref.value = ref.value.substring(0, e.target.selectionStart) + ref.value.substring(e.target.selectionEnd)

        return
    }

    if (ref.value !== null && ref.value[ref.value.length - 2] === delimiter) {
        ref.value = ref.value.slice(0, -2)
        return
    }

    ref.value = ref.value === null ? ref.value : ref.value.slice(0, -1)
}

const handleNumbers = (e, ref, delimiter) => {
    if (
        ref.value?.length === 2 ||
        ref.value?.length === 5
    ) {
        if (ref.value.length === 2 && e.key.match(/[2-9]/)) {
            ref.value = ref.value + delimiter + '0' + e.key
            return
        }

        ref.value = ref.value + delimiter + e.key

        return
    }

    if ((ref.value?.length === 1) && ref.value === '3' && e.key.match(/[2-9]/)) {
        ref.value = ref.value + '1'
        return;
    }

    if ((ref.value?.length === 4) && ref.value[ref.value.length - 1] === '1' && e.key.match(/[3-9]/)) {
        ref.value = ref.value + '2'
        return;
    }

    if ((ref.value === null || ref.value === '') && e.key.match(/[4-9]/)) {
        ref.value = '0' + e.key

        return
    }

    if (ref.value?.length === 10) {
        return
    }

    ref.value = (ref.value !== null ? ref.value : '') + e.key
}

const handleNumbersDateTime = (e, ref, delimiter) => {
    if (
        ref.value?.length === 2 ||
        ref.value?.length === 5
    ) {
        if (ref.value.length === 2 && e.key.match(/[2-9]/)) {
            ref.value = ref.value + delimiter + '0' + e.key
            return
        }

        ref.value = ref.value + delimiter + e.key

        return
    }

    if ((ref.value?.length === 1) && ref.value === '3' && e.key.match(/[2-9]/)) {
        ref.value = ref.value + '1'
        return;
    }

    if ((ref.value?.length === 4) && ref.value[ref.value.length - 1] === '1' && e.key.match(/[3-9]/)) {
        ref.value = ref.value + '2'
        return;
    }

    if ((ref.value?.length === 10) && e.key.match(/[3-9]/)) {
        ref.value = ref.value + ' 0' + e.key
        return;
    }

    if ((ref.value?.length === 13)) {

        if (e.key.match(/[6-9]/)) {
            ref.value = ref.value + ':0' + e.key
            return
        }

        ref.value = ref.value + ':' + e.key
        return;
    }

    if ((ref.value === null || ref.value === '') && e.key.match(/[4-9]/)) {
        ref.value = '0' + e.key

        return
    }

    if (ref.value?.length === 10) {

        ref.value = ref.value + ' ' + e.key
        return
    }

    if (ref.value?.length === 16) {
        return
    }

    ref.value = (ref.value !== null ? ref.value : '') + e.key
}