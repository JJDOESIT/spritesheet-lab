import styles from "../alert/alert.module.css";

interface AlertProps {
  backgroundColor: string;
  hidden: boolean;
  borderColor: string;
  fontColor: string;
  message: string;
  toggleHidden: Function;
  maxWidth: number;
}

export default function Alert(props: AlertProps) {
  return (
    <div
      className={`h-50 w-full relative ${styles.alertContainer}`}
      hidden={props.hidden}
      style={{
        backgroundColor: props.backgroundColor,
        border: props.borderColor,
        maxWidth: props.maxWidth,
      }}
    >
      <div className={`w-4/5 ${styles.alertMessageContainer}`}>
        <p style={{ color: props.fontColor }} className="text-sm">
          {props.message}
        </p>
      </div>
      <div
        className={`rounded-lg justify-center w-1/5 h-full  absolute ${styles.alertButtonContainer}`}
        onClick={() => {
          props.toggleHidden();
        }}
      >
        <input type="button" value="X"></input>
      </div>
    </div>
  );
}
