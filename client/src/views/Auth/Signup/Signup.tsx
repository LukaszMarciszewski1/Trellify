import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import styles from './styles.module.scss'
import Loading from '../../../components/Details/Loading/Loading'

const Signup = () => {
  // const [data, setData] = useState({
  //   firstName: '',
  //   lastName: '',
  //   email: '',
  //   password: '',
  // })
  // const [error, setError] = useState('')
  // const navigate = useNavigate()

  // const handleChange = ({ currentTarget: input }) => {
  //   setData({ ...data, [input.name]: input.value })
  // }

  // const handleSubmit = async (e) => {
  //   e.preventDefault()
  //   try {
  //     const url = 'http://localhost:5000/api/users'
  //     const { data: res } = await axios.post(url, data)
  //     navigate('/login')
  //     console.log(res.message)
  //   } catch (error) {
  //     if (
  //       error.response &&
  //       error.response.status >= 400 &&
  //       error.response.status <= 500
  //     ) {
  //       setError(error.response.data.message)
  //     }
  //   }
  // }
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    const url = `${process.env.REACT_APP_API_URL}users`
    if (password !== confirmPassword) {
      console.log("Passwords do not match");
    } else {
      try {
        const config = {
          headers: {
            'Content-type': 'application/json',
          },
        }
        setLoading(true)
        const { data: res } = await axios.post(url,
          {
            name,
            email,
            password,
          },
          config
        )
        console.log(res.message)
        navigate('/login')
        setLoading(false)
      } catch (error: any) {
        if (
          error.response &&
          error.response.status >= 400 &&
          error.response.status <= 500
        ) {
          setError(error.response.data.message)
        }
      }
      setLoading(false)
    };
  }

  return (
    <div className={styles.signup_container}>
      <div className={styles.signup_form_container}>
        <div className={styles.left}>
          <h1>Witaj ponownie</h1><br />
          <Link to='/login'>
            <button type='button' className={styles.white_btn}>
              Logowanie
            </button>
          </Link>
        </div>
        <div className={styles.right}>
        {loading ? <Loading /> : null}
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1>Utwórz konto</h1>
            <input
              type='text'
              placeholder='Imię'
              name='firstName'
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
              className={styles.input}
            />
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
                        <input
              type='password'
              placeholder='Powtórz hasło'
              name='confirm-password'
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              required
              className={styles.input}
            />
            {error && <div className={styles.error_msg}>{error}</div>}
            <button type='submit' className={styles.green_btn}>
              Rejestracja
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Signup
