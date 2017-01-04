using UnityEngine;
using System.Collections;

public class CameraAction : MonoBehaviour {

    public enum RotationAxes { MouseXAndY = 0, MouseX = 1, MouseY = 2 }
    public RotationAxes axes = RotationAxes.MouseXAndY;
    public float sensitivityX = 15F;
    public float sensitivityY = 15F;

    public float minimumX = -360F;
    public float maximumX = 360F;

    public float minimumY = -60F;
    public float maximumY = 60F;

    float rotationY = 0F;

    void RotateCamera()
    {
        if (axes == RotationAxes.MouseXAndY)
        {
            float rotationX = transform.localEulerAngles.y + Input.GetAxis("Mouse X") * sensitivityX;

            rotationY += Input.GetAxis("Mouse Y") * sensitivityY;
            rotationY = Mathf.Clamp(rotationY, minimumY, maximumY);

            transform.localEulerAngles = new Vector3(-rotationY, rotationX, 0);
        }
        else if (axes == RotationAxes.MouseX)
        {
            transform.Rotate(0, Input.GetAxis("Mouse X") * sensitivityX, 0);
        }
        else
        {
            rotationY += Input.GetAxis("Mouse Y") * sensitivityY;
            rotationY = Mathf.Clamp(rotationY, minimumY, maximumY);

            transform.localEulerAngles = new Vector3(-rotationY, transform.localEulerAngles.y, 0);
        }
    }

    public float speed = 5;
    public float jumpSpeed = 0;

    void MoveCamera()
    {
        Vector3 directionVector = new Vector3(Input.GetAxis("Horizontal"), 0, Input.GetAxis("Vertical"));

        if (directionVector != Vector3.zero)
        {
            float directionLength = directionVector.magnitude;

            directionVector = directionVector / directionLength;

            directionLength = Mathf.Min(1, directionLength);

            directionLength = directionLength * speed * 3;

            transform.Translate(directionVector * directionLength * Time.deltaTime);

        }

    }

    void JumpUpdate()
    {
        Vector3 moveDirection = new Vector3(0.0f, jumpSpeed, 0.0f);
        moveDirection = transform.TransformDirection(moveDirection);
        moveDirection *= speed;
        transform.Translate(moveDirection * Time.deltaTime);
    }


    void Update()
    {
        if (Input.GetKeyDown(KeyCode.Space))
        {
            jumpSpeed = 35 * 3;
            JumpUpdate();
        }
        MoveCamera();
        RotateCamera();
        jumpSpeed = 0;
    }

    void Start()
    {
        if (GetComponent<Rigidbody>())
            GetComponent<Rigidbody>().freezeRotation = true;
    }
}
