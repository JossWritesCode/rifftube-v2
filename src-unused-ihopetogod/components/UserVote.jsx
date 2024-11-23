import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';

const UserVote = ({
  gradeeId,
  userInfo,
}) =>
{
  const [localGrade, setLocalGrade] = useState(undefined);

  useEffect(() => {
    fetch(`/grade/${gradeeId}`)
        .then(response => response.json())
        .then(json => setLocalGrade(json.grade));
  }, [gradeeId]);

  const updateGrade = useCallback(grade =>
  {
    fetch(`/grade/${gradeeId}`,
    {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ grade }),
    })
    .then(response => response.json())
    .then(res => {
        debugger;
        setLocalGrade(res.grade);
    }).catch(err => console.log("error", err));
  }, [gradeeId]);


  return (userInfo && localGrade !== undefined && userInfo.id != localGrade.grader ?
    (
        <div className="user-grade-control-container">
          <h4>User Grade:</h4>
          <label>
            👎
            <input type="radio" name="user-grade" checked={localGrade < 0} onChange={() => updateGrade(-1)} />
          </label>
          <label>
            🤷‍♀️
            <input type="radio" name="user-grade" checked={localGrade == 0} onChange={() => updateGrade(0)} />
          </label>
          <label>
            👍
            <input type="radio" name="user-grade" checked={localGrade > 0} onChange={() => updateGrade(1)} />
          </label>
        </div>
    )
    :
    null);
};

let mapStateToProps = (state) => ({
    userInfo: state.userInfo,
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(UserVote);
