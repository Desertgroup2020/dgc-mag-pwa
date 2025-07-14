import useAuth from "@/features/authentication/hooks/useAuth";
import * as Yup from "yup";
import { useFormik } from "formik";


const validationSchema = Yup.object().shape({
    email: Yup.string().required().email().label("Email"),
  });
  

  function useNewsLetterForm() {
    const {
      subscribeEmailToNewsletter: [
        subscribeEmailToNewsletter,
        subscribeEmailToNewsletterStatus,
      ],
    } = useAuth();
  
    const newsLetterForm = useFormik({
      initialValues: {
        email: "",
      },
      validationSchema,
      onSubmit: (values,{resetForm}) => {
        subscribeEmailToNewsletter({ variables: { email: values.email } });
        resetForm()
      },
    });
    


    return { newsLetterForm, subscribeEmailToNewsletterStatus };
  }
  
  export default useNewsLetterForm;