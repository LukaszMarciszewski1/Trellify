import { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import styles from './styles.module.scss'
import Loading from '../../../components/Details/Loading/Loading'

const Login = () => {
  const [data, setData] = useState({ email: '', password: '' })
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<false | string>(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    const url = `${process.env.REACT_APP_API_URL}users/login`
    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      }
      setLoading(true)
      const { data } = await axios.post(
        url,
        {
          email,
          password,
        },
        config
      )
      localStorage.setItem('token', JSON.stringify(data))
      window.location.href = '/'
      setLoading(false)
    } catch (error) {
      // setError(error.response.data.message)
      setError("Nieprawidłowy email lub hasło")
      setLoading(false)
    }
  }

  return (
    <div className={styles.login_container}>
      <div className={styles.login_form_container}>
        <div className={styles.left}>
          {loading ? <Loading /> : null}
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1>Zaloguj się</h1>
            <input
              type='email'
              placeholder='Email'
              name='email'
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              className={styles.input}
            />
            <input
              type='password'
              placeholder='Hasło'
              name='password'
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
              className={styles.input}
            />
            {error && <div className={styles.error_msg}>{error}</div>}
            <button type='submit' className={styles.green_btn}>
              Logowanie
            </button>
          </form>
        </div>
        <div className={styles.right}>
          <h1>Zarejestruj się</h1> <br />
          <Link to='/signup'>
            <button type='button' className={styles.white_btn}>
              Rejestracja
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
