import axios from 'axios'
import './Blog.module.scss'
import { Form } from '../../types/Form'
import styles from './Blog.module.scss'
import { NavLink } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Blog() {


  const [postsCount, setpostsCount] = useState(0);
  const prevPostsCount = useRef(0);

  useEffect(() => {
    if (postsCount === prevPostsCount.current + 1) {
      toast.success('New blog entry added!');
      prevPostsCount.current = postsCount;
    }
  }, [postsCount]);

  const url = 'http://localhost:3004/posts';

  const shortContent = (content: string) => {
    const result = content.split(' ').splice(0, 15).join(' ') + '...';
    return result
  }

    const { isLoading, error, data } = useQuery({
      queryKey: ["blogCards"],
      queryFn: () =>
      axios.get(url)
      .then( ({ data }) => {
        setpostsCount(data.length)
        return data
      })
    })

    if (isLoading) return <h1>Loading...</h1>;
  
    if (error) return <h1>An error has occurred!</h1>;

    if (prevPostsCount.current === 0) {
      prevPostsCount.current = data.length
    }

  return (
      <div className={styles.cardContainer}>
        <ToastContainer />
        <h2 className={styles.title}>This is blog section</h2>
        {data.map((post: Form) => (
          <div className={styles.card} key={post.id}>
            <img src={post.image} alt={post.title} />
              <div className={styles.text_content}>
                <span className={styles.title}>{post.title}</span>
                <span className={styles.content}>
                  {shortContent(post.content)}
                  <span className={styles.comment_count}>
                    {` ( ${post.commentCount?post.commentCount:0} )`}
                  </span>
                </span>
                <span className={styles.date}>{String(post.date)}</span>
                <span className={styles.link}><NavLink to={`/blog/${post.id}`}><u>Read more</u></NavLink></span>
              </div>
          </div>
        ))}
      </div>
  )
}

export default Blog