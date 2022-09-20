import { Link } from 'react-router-dom'
import styles from './styles.module.scss'
import { useAuth } from '../../../hooks/useAuth'
import { useForm } from 'react-hook-form';
import { User } from '../../../models/user'
import Loading from '../../../components/Details/Loading/Loading'
import Input from '../../../components/Details/Input/Input'
import ErrorMessage from '../../../components/Details/Messages/ErrorMessage';

const validation = {
  name: {
    required: true,
    maxLength: 20,
    minLength: 2,
  },
  email: {
    required: true,
    pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  },
  password: {
    required: true,
    pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/
  }
}

const SignUp: React.FC = () => {
  const { loading, signUp } = useAuth()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<User>();

  const nameErrors = (type: any) => {
    switch (type) {
      case 'required':
        return <ErrorMessage message={'Imię jest wymagane'} />
      case 'minLength':
        return <ErrorMessage message={'Imię musi zawierać conajmiej 2 znaki'} />
      case 'maxLength':
        return <ErrorMessage message={'Imię może zawierać maksymalnie 20 znaków'} />
      default:
        return null
    }
  }

  const emailErrors = (type: any) => {
    switch (type) {
      case 'required':
        return <ErrorMessage message={'Email jest wymagany'} />
      case 'pattern':
        return <ErrorMessage message={'Email jest niepoprawny'} />
      default:
        return null
    }
  }

  const passwordErrors = (type: any) => {
    switch (type) {
      case 'required':
        return <ErrorMessage message={'Hasło jest wymagane'} />
      case 'pattern':
        return <ErrorMessage message={'Hasło musi zawierać: co najmniej 8 znaków, 1 cyfrę, 1 małą literę i 1 wielką literę'} />
      default:
        return null
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.signup_formContainer}>
        <div className={styles.left}>
          <h1>Zaloguj się</h1><br />
          <Link to='/logowanie'>
            <button type='button' className={styles.white_btn}>
              Logowanie
            </button>
          </Link>
        </div>
        <div className={styles.right}>
          {loading ? <Loading /> : null}
          <form className={styles.form_container} onSubmit={handleSubmit(signUp)}>
            <h1>Utwórz konto</h1>
            <Input
              id={'name'}
              placeholder={'Imię'}
              label={'Imię'}
              type="text"
              error={errors.name}
              {...register("name", { ...validation.name })}
            />
            {nameErrors(errors.name?.type)}
            <Input
              id={'email'}
              placeholder={'email'}
              label={'Email'}
              type="text"
              {...register("email", { ...validation.email })}
            />
            {emailErrors(errors.email?.type)}
            <Input
              id={'password'}
              placeholder={'password'}
              label={'Password'}
              type="password"
              {...register("password", { ...validation.password })}
            />
            {passwordErrors(errors.password?.type)}
            <Input
              id={'confirm_password'}
              placeholder={'confirm password'}
              label={'Confirm Password'}
              type="password"
              {...register("confirm_password", {
                required: true, validate: (val: string) => val === watch('password')
              })}
            />
            {errors.confirm_password && <ErrorMessage message={'Wpisz poprawne hasło'} />}
            <button type='submit' className={styles.green_btn}>
              Rejestracja
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignUp
