using System;
using UnityEngine;

namespace MythicJewels.Gameplay
{
    public class SwipeInputHandler : MonoBehaviour
    {
        [SerializeField] private float minSwipeDistance = 50f; // in pixels
        private Vector2 _touchStartPos;
        private Vector2 _touchEndPos;
        private bool _isSwiping = false;

        public event Action<Vector2, Vector2> OnSwipeDetected; // (startPos, directionVector)

        private void Update()
        {
            HandleTouchInput();
            HandleMouseInput();
        }

        private void HandleTouchInput()
        {
            if (Input.touchCount > 0)
            {
                Touch touch = Input.GetTouch(0); // Single-touch Focus

                if (touch.phase == TouchPhase.Began)
                {
                    _touchStartPos = touch.position;
                    _isSwiping = true;
                }
                else if (touch.phase == TouchPhase.Moved || touch.phase == TouchPhase.Ended)
                {
                    if (_isSwiping)
                    {
                        _touchEndPos = touch.position;
                        Vector2 swipeVector = _touchEndPos - _touchStartPos;

                        if (swipeVector.magnitude >= minSwipeDistance)
                        {
                            _isSwiping = false;
                            Vector2 direction = CalculatePrimaryDirection(swipeVector);
                            OnSwipeDetected?.Invoke(_touchStartPos, direction);
                        }
                    }
                }
            }
        }

        private void HandleMouseInput()
        {
            if (Input.GetMouseButtonDown(0))
            {
                _touchStartPos = Input.mousePosition;
                _isSwiping = true;
            }
            else if (Input.GetMouseButtonUp(0) && _isSwiping)
            {
                _isSwiping = false;
                _touchEndPos = Input.mousePosition;
                Vector2 swipeVector = _touchEndPos - _touchStartPos;

                if (swipeVector.magnitude >= minSwipeDistance)
                {
                    Vector2 direction = CalculatePrimaryDirection(swipeVector);
                    OnSwipeDetected?.Invoke(_touchStartPos, direction);
                }
            }
        }

        private Vector2 CalculatePrimaryDirection(Vector2 swipe)
        {
            if (Mathf.Abs(swipe.x) > Mathf.Abs(swipe.y))
            {
                return swipe.x > 0 ? Vector2.right : Vector2.left;
            }
            else
            {
                return swipe.y > 0 ? Vector2.up : Vector2.down;
            }
        }
    }
}
