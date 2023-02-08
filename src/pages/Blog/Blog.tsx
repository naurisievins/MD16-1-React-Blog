import axios from 'axios'
import './Blog.module.scss'
import { Form } from '../../types/Form'
import styles from './Blog.module.scss'
import { NavLink } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

function Blog() {

  const url = 'http://localhost:3004/posts';

  const shortContent = (content: string) => {
    const result = content.split(' ').splice(0, 15).join(' ') + '...';
    return result
  }

    const { isLoading, error, data } = useQuery({
      queryKey: ["blogCards"],
      queryFn: () =>
      axios.get(url)
      .then( ({ data }) => data)
    })

    if (isLoading) return <h1>Loading...</h1>;
  
    if (error) return "An error has occurred!";

  return (
    <div className={styles.cardContainer}>
      {data.map((post: Form) => (
        <div className={styles.card} key={post.id}>
          <img src={post.image} alt={post.title} />
            <div className={styles.text_content}>
              <span className={styles.title}>{post.title}</span>
              <span className={styles.content}>{shortContent(post.content)}</span>
              <span className={styles.date}>{String(post.date)}</span>
              <span className={styles.link}><NavLink to={`/blog/${post.id}`}><u>Read more</u></NavLink></span>
            </div>
        </div>
      ))}
    </div>
  )
}

export default Blog