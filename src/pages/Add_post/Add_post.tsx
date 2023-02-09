import styles from './Add_post.module.scss'
import axios from 'axios'
import { useState } from 'react'
import { Form } from '../../types/Form'
import { useNavigate } from "react-router-dom";
import dateFormat from '../../components/Time';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function Add_post() {

  const navigate = useNavigate();

  const initFormValues = {
    title: '',
    image: '',
    content: '',
    date: dateFormat()
  }

  const [formValues, setFormValues] = useState<Form>(initFormValues);
  const url = 'http://localhost:3004/posts';
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (form: Form) => axios.post(url, {...form}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogCards'] })
    },
  })

  const handleSubmit = (form: Form) => {
    mutation.mutate(form);
    setFormValues(initFormValues);
    navigate('/blog', { replace: true });
  }

  return (
    <form className={styles.addForm}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(formValues);
          }}
    >
      <h2 className={styles.title}>Add new post</h2>
      <label>
        Image link:
        <input type='text'
              required
              value={formValues.image}
              placeholder='Imāž...'
              onChange={(e) => {setFormValues({...formValues, image: e.target.value })} }
        />
      </label>

      <label>
        Title:
        <input type='text'
              required
              value={formValues.title}
              placeholder='Title...' 
              onChange={(e) => {setFormValues({...formValues, title: e.target.value })}}
        />
      </label>

      <label>
        Content:
        <textarea placeholder='Content...'
                  required
                  value={formValues.content}
                  onChange={(e) => {setFormValues({...formValues, content: e.target.value })}}
        />
      </label>

      <button>Submit</button>
    </form>
  )
}

export default Add_post