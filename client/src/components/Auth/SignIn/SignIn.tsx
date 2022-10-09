import { Link } from 'react-router-dom';
import styles from './styles.module.scss'
import { User } from 'models/user'
import { useAuth } from 'hooks/useAuth'
import { useForm } from 'react-hook-form';
import Input from 'components/common/Input/Input'
import ErrorMessage from 'components/common/Messages/ErrorMessage';
import Loading from 'components/common/Loading/Loading'

const SignIn: React.FC = () => {
  const { loading, signIn } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>();

  return (
    <div className={styles.auth}>
      <div className={styles.formContainer}>
        <div className={styles.left}>
          {loading ? <Loading /> : null}
          <form className={styles.form} onSubmit={handleSubmit(signIn)}>
            <h1>Zaloguj się</h1>
            <Input
              id={'email'}
              placeholder={'email'}
              label={'Email'}
              type="text"
              {...register("email", { required: true })}
            />
            {errors.email && <ErrorMessage message={'Email jest wymagany'} />}
            <Input
              id={'password'}
              placeholder={'password'}
              label={'Password'}
              type="password"
              {...register("password", { required: true })}
            />
            {errors.password && <ErrorMessage message={'Hasło jest wymagane'} />}
            <button type='submit' className={styles.blueBtn}>
              Logowanie
            </button>
          </form>
        </div>
        <div className={styles.right}>
          <h1>Zarejestruj się</h1> <br />
          <Link to='/rejestracja'>
            <button type='button' className={styles.whiteBtn}>
              Rejestracja
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SignIn