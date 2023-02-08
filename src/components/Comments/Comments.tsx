import styles from './Comments.module.scss'
import axios from 'axios';
import { Comment } from '../../types/Comment';
import { v4 as uuidv4 } from 'uuid';
import default_user from '../../assets/images/default_user.png'
import { useQuery } from '@tanstack/react-query';

function Comments(props: { id: string | undefined }) {

  const url = `http://localhost:3004/posts/${props.id}`;

  const { isLoading, error, data } = useQuery({
    queryKey: ["comments"],
    queryFn: () =>
    axios.get(url)
    .then(({ data }) => {
      if (data.comments && data.comments.length) {
        return data.comments
      } else {
        return null
      }
    })
  })

  if (isLoading) return <h1>Loading...</h1>;

  if (!data) return <span>No one has commented yet.</span>;
  
  if (error) return <h1>An error has occurred!</h1>;

  return (
    <div className={styles.comment_container}>
      {data.map((comment: Comment) => (
        <div className={styles.comment} key={uuidv4()}>

          <div className={styles.col}>
            <div className={styles.ico_container}>
              <img src={default_user} alt='Default user icon' />
            </div>
          </div>
          <div className={styles.col}>
            <div className={styles.author}>{comment.author}</div>
            <div className={styles.text}>{comment.comment}</div>
            <div className={styles.date}>{comment.date}</div>
        </div>
      </div>
      ))}
    </div>
  )
}

export default Comments