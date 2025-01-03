import { defineNuxtPlugin } from '#app'
import { i18nAddResources } from '@wangeditor/editor'

export default defineNuxtPlugin((nuxtApp) => {
    i18nAddResources('ru', {
        undo: {
            undo: 'Назад',
            redo: 'Вперед'
        },
        divider: {
            title: 'Разделитель'
        },
        codeBlock: {
            title: 'Код'
        },
        link: {
            insert: 'Ссылка',
            text: 'Текст',
            url: 'URL'
        },
        tableModule: {
            insertTable: 'Таблица',
            header: 'Заголовок',
            widthAuto: 'Авто-ширина',
            insertRow: 'Вставить строку',
            insertCol: 'Вставить колонку',
            deleteRow: 'Удалить строку',
            deleteCol: 'Удалить колонку',
            deleteTable: 'Удалить таблицу'
        },
        videoModule: {
            insertVideo: 'Видео',
            videoSrc: 'Ссылка',
            videoPoster: 'Заставка',
            ok: 'ок',
            videoSrcPlaceHolder: '',
            videoPosterPlaceHolder: ''
        },
        image: {
            netImage: 'Изображение',
            src: 'Ссылка',
            desc: 'Описание',
            link: 'data-href (необязательно)',
            edit: 'Редактировать',
            delete: 'Удалить',
            viewLink: 'Ссылка'
        },
        blockQuote: {
            title: 'Цитата'
        },
        todo: {
            todo: 'Чекбокс'
        },
        justify: {
            left: 'Влево',
            right: 'Вправо',
            center: 'Центр',
            justify: 'По ширине'
        },
        header: {
            text: 'Текст',
            title: 'Текст'
        },
        listModule: {
            unOrderedList: 'Маркированный',
            orderedList: 'Нумерованный',
        },
        textStyle: {
            bold: 'Жирный',
            italic: 'Курсив',
            through: 'Зачеркнуть',
            code: 'Код',
            underline: 'Подчернуть',
            clear: 'Очистить'
        },
        highLightModule: {
            selectLang: 'Язык'
        },
        color: {
            color: 'Цвет текста',
            bgColor: 'Цвет фона',
            default: 'По-умолчанию',
            clear: 'Без фона'
        },
        common: {
            ok: 'ок',
            enter: 'Ввод'
        }
    })
})