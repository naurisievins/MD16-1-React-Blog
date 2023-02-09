import styles from './Post.module.scss';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Form } from '../../types/Form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';
import AddComment from '../../components/AddComment/AddComment';
import dateFormat from '../../components/Time';
import Comments from '../../components/Comments/Comments';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';

function Post() {

  const initFormValues = {
    title: '',
    image: '',
    content: ''
  }

  const { id } = useParams();

  const url = `http://localhost:3004/posts/${id}`;
  const [showEdit, setShowEdit] = useState(false);
  const [formValues, setFormValues] = useState(initFormValues);

  const { isLoading : postDataLoading, isError: postDataError, data: postData } = useQuery({
    queryKey: ["postData"],
    queryFn: () =>
    axios.get(url)
    .then(({ data }) => data)
  })

  useEffect(() => {
    if (!postDataLoading && !postDataError) {
      setFormValues({image: postData.image, title: postData.title, content: postData.content})
    }
  }, [postData])

  const { isLoading, error, data: comment } = useQuery({
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

  const mutationEditPosst = useMutation({
    mutationFn: ({title, image, content}: Form) => axios.patch(url, {title, image, content}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['postData'] });
      setShowEdit(!showEdit);
      toast.success('Post edited!');
      setFormValues(initFormValues);
    },
    onError: () => {
      toast.error('Something went wrong!')
    }
  })

  const editPost = () => {
    return (
    <form className={styles.addForm}
          onSubmit={(e) => {
            e.preventDefault();
            mutationEditPosst.mutate(formValues)
          }}
    >
      <h2>Edit post</h2>
      <label>
        Image link:
        <input  type='text'
                value={formValues.image}
                onChange={(e) => {setFormValues({...formValues, image: e.target.value })}}
        />
      </label>

      <label>
        Title:
        <input  type='text'
                value={formValues.title}
                onChange={(e) => {setFormValues({...formValues, title: e.target.value })}}
        />
      </label>

      <label>
        Content:
        <textarea placeholder='Content...'
                  value={formValues.content}
                  onChange={(e) => {setFormValues({...formValues, content: e.target.value })}}
        />
      </label>

      <button>Submit</button>

    </form>
    ) 
    
  }

  const queryClient = useQueryClient()

  type AddComment = {
    msg: string
    author: string
  }

  const mutationWithPrevComments = useMutation({
    mutationFn: ({msg, author}: AddComment) => axios
      .patch(url, {commentCount: comment.length +1, 'comments':[...comment, {id: uuidv4(), comment: msg, author, date: dateFormat()}]}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] })
      queryClient.invalidateQueries({ queryKey: ['postData'] })
    },
  })

  const mutationWithoutPrevComments = useMutation({
    mutationFn: ({msg, author}: AddComment) => axios
      .patch(url, {commentCount: 1, 'comments':[{id: uuidv4(), comment: msg, author, date: dateFormat()}]}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] })
      queryClient.invalidateQueries({ queryKey: ['postData'] })
    },
  })

  const addComment = (author: string, msg: string) => {
    if (comment) {
      mutationWithPrevComments.mutate({msg, author})
    } else {
      mutationWithoutPrevComments.mutate({msg, author})
    }
  }

  if (!postData) {
    return <h1>No data found!</h1>
  }

  return (
    <div className={styles.container}>
      <div className={styles.postContainer}>
        <button className={styles.edit_button} 
                onClick={() => setShowEdit(!showEdit)}
        >
          {showEdit ? 'Cancel' : 'Edit post'}
        </button>
        {showEdit ? 
          editPost() :
          <div className={styles.card}>
            <div className={styles.img_container}>
              <img src={postData?.image}
                   alt={postData?.title} 
              />
            </div>
            <div className={styles.text_content}>
              <span className={styles.title}>{postData?.title}</span>
              <span className={styles.content}>{postData?.content}</span>
              <span className={styles.date}>{String(postData?.date)}</span>
            </div>
          </div>
        }
      </div>
      <div>
        <h3 className={styles.comment_section_title}>Comment section</h3>
        <Comments id = { id } />
        {!showEdit && <AddComment addComment={(author, msg) => addComment(author, msg)} />}
      </div>
      
      <ToastContainer />
    </div>
  )
}

export default Post