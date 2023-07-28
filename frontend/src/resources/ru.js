const ru = {
  translation: {
    signUp: {
      errors: {
        usernameYupRequired: 'Введите имя пользователя 🩰',
        usernameYupMin: 'От 3 до 20 символов',
        usernameYupMax: 'От 3 до 20 символов',
        passwordYupRequired: 'Введите пароль 🫥',
        passwordYupMin: 'Не менее 6 символов',
        passwordAgainOneOf: 'Пароли должны совпадать',
        passwordAgainRequired: 'Подтвердите пароль',
        catchedError: 'Такое имя занято 🫣',
      },
      texts: {
        regForm: 'Форма регистрации',
        username: 'Имя пользователя',
        password: 'Пароль',
        passwordAfain: 'Подтвердите пароль',
        ButtonReg: 'Регистрация',
        ButtonLog: 'Войти',
      },
    },
    login: {
      errors: {
        usernameYupRequired: 'Введите имя пользователя 🤨',
        passwordYupRequired: 'Введите пароль 🥱',
        errorAuth: 'Произошла ошибка при авторизации 😬',
      },
      texts: {
        authForm: 'Форма авторизации',
        username: 'Имя пользователя',
        password: 'Пароль',
        ButtonLog: 'Войти',
        ButtonReg: 'Регистрация',
      },
    },
    chat: {
      errors: {
        unAuthUser: 'Неавторизованный пользователь!!! Войдите или зарегистрируйтесь 😪',
        notSelectedChannel: 'Надо выбрать канал 😩',
        empetyMess: 'Поле для ввода пустое 🤕',
        empetyChan: 'Имя канала не должно быть пустым 😏',
        alreadyChan: 'Канал уже существует 🤦‍♂️',
        deleteDefaultChan: 'Нельзя удалять стандартные каналы 😭',
        renameDefaultChan: 'Этому каналу нельзя поменять имя 😒',
      },
      texts: {
        ButtonLog: 'Войти',
        ButtonReg: 'Регистрация',
        channList: 'Список каналов',
        confirmDelete: 'Подтверждение удаления',
        confirmDeleteRURealy: 'Вы уверены, что хотите удалить канал?',
        confirmDeleteCancel: 'Отмена',
        confirmDeleteDeletion: 'Удалить',
        actions: 'Действия',
        addChannel: 'Добавить канал',
        deleteChan: 'Удалить канал',
        renameChan: 'Переименовать канал',
        addChan: 'Добавить канал',
        nameChan: 'Имя канала',
        add: 'Добавить',
        newNameChan: 'Новое имя канала',
        rename: 'Переименовать',
        channel: 'Канал',
        chooseChannel: 'Выберите канал',
        send: 'Отправить',
        enterMess: 'Введите сообщение',
        toastChanSucc: 'Канал успешно создан!! 🥰',
        toastChanDeleteSucc: 'Канал успешно удалён!! 😣',
        toastChanRenameSucc: ' Канал успешно переименован!! 😤',
      },
    },
    notFound: {
      texts: {
        404: '404 - Не найдено',
        page404: 'Страница не найдена',
      },
    },
    header: {
      texts: {
        signOutBtn: 'Выйти',
      },
    },
  },
};

export default ru;
