import { useState } from 'react';
import styles from './AddComment.module.scss'
import default_user from '../../assets/images/default_user.png'
import { ChangeProps } from '../../types/ChangeProps';

function AddComment({ addComment }: ChangeProps) {

  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentContent, setCommentContent] = useState('');

  return (
    <form className={styles.add_comment_form} onSubmit={(e => {
          e.preventDefault();
          addComment(commentAuthor, commentContent);
          setCommentAuthor('');
          setCommentContent('')
          })}
    >
      <div className={styles.row}>
        <div className={`${styles.col} ${styles.avatar}`}>
          <img src={default_user} alt='Default user icon'></img>
        </div>

        <div className={styles.col}>
          <label>
            Name
            <input value={commentAuthor}
                   className={styles.input}
                   required
                   placeholder='Your name...'
                   onChange={(e => setCommentAuthor(e.target.value))} />
          </label>

          <label>
            Comment
            <textarea value={commentContent}
                      className={styles.input}
                      required
                      placeholder='Your comment...'
                      onChange={(e => setCommentContent(e.target.value))} />
          </label>
        </div>
      </div>

      <div className={`${styles.row} ${styles.button_row}`}>
        <button>Add comment</button>
      </div>

    </form>
  )
}

export default AddComment