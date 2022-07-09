import * as yup from "yup";

const schema = yup.object().shape({
    name: yup.string().required(),
    type: yup.string().required(),
    doctor: yup.string().required(),
    datetime: yup.string().required(),
    phone: yup.string().required(),
});

export default schema;
