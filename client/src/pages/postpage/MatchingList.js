import React, { memo, useState } from "react";
import { useEffect } from "react";
import { Link, Outlet, Route, Routes } from "react-router-dom";
import styled, { css } from "styled-components";
import Matching from "./Matching";

const MatchingList = memo(
	({ open, close, matchingList, loadMatching, loadParticipants }) => {
		const [matchingId, setMatchingId] = useState("");
		const [matchingData, setMatchingData] = useState({});

		//TODO: pagination 필요. 화살표 등으로 넘기면 다음 20개를 가져오도록 설정하기

		// 스크롤 방지
		useEffect(() => {
			document.body.style.cssText = `
          position: fixed; 
          top: -${window.scrollY}px;
          overflow-y: scroll;
          width: 100%;`;
			return () => {
				const scrollY = document.body.style.top;
				document.body.style.cssText = "";
				window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
			};
		}, []);

		const loadMatchingData = (matchingId) => {
			setMatchingId(matchingId);
		};

		return (
			<Modal>
				<div className={open ? "openMatchingModal modal" : "modal"}>
					<MatchingListContainer>
						{open ? (
							<>
								<header>
									<p>신청자 명단</p>
									<button className="closeButton" onClick={close}>
										닫기
									</button>
								</header>
								<div className="matchingSection">
									{matchingId && (
										<Matching
											matchingId={matchingId}
											setMatchingData={setMatchingData}
											matchingData={matchingData}
											loadMatching={loadMatching}
											loadParticipants={loadParticipants}
										/>
									)}
								</div>
								<div className="listSection">
									<button className="actionButton prevButton"> {"<"} </button>
									{matchingList.length > 0 ? (
										matchingList.map((el, idx) => (
											<Match key={idx} status={el.matchingStatus}>
												<div
													className="memberItem"
													onClick={() => loadMatchingData(el.matchingId)}>
													<img src={el.profileImage} alt={el.profileImage} />
													<span className="memberName"> {el.memberName} </span>
													<span className="matchingStatus">
														{el.matchingStatus === "READ" && <span>읽음</span>}
														{el.matchingStatus === "NOT_READ" && (
															<span>읽지 않음</span>
														)}
														{el.matchingStatus === "REFUSED" && (
															<span>거절</span>
														)}
														{el.matchingStatus === "ACCEPTED" && (
															<span>수락</span>
														)}
													</span>
												</div>
												{/* {memberId === String(el.memberId) ? (
										<div>
											<button
												onClick={() => {
													withdrawal(el.matchingId);
												}}>
												신청 취소
											</button>
											<button
												onClick={() => {
													chatHandler();
												}}>
												작성자와 대화하기
											</button>
										</div>
									) : null} */}
											</Match>
										))
									) : (
										<div>신청한 사람이 없습니다. 하하하하하하하하.</div>
									)}
									<button className="actionButton nextButton"> {">"} </button>
								</div>
							</>
						) : null}
					</MatchingListContainer>
				</div>
			</Modal>
		);
	}
);

export default MatchingList;
const Modal = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.4);
	display: flex;
	justify-content: center;
	align-items: center;
`;
const MatchingListContainer = styled.div`
	width: 72% !important;
	max-width: 960px;
	min-height: 720px;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 0 0.5rem 0 0.5rem;
	z-index: 999;

	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);

	background-color: white;
	box-shadow: 1px 5px 10px rgba(0, 0, 0, 0.5);

	header {
		width: 100%;
		display: flex;
		align-items: center;
		border-bottom: 1px solid rgba(0, 0, 0, 0.4);

		p {
			margin: 0.5rem;
			font-size: 1.5rem;
			font-weight: 600;
		}
	}

	.closeButton {
		margin-left: auto;
	}

	.matchingSection {
		display: flex;
		width: 100%;
		min-height: 540px;
	}

	.listSection {
		padding-bottom: 1.25rem;
		width: 100%;
		flex: 1;
		display: flex;
		overflow-x: auto;
	}

	.actionButton {
		margin: auto;

		&.prevButton {
			margin-left: 0.5rem;
			margin-right: auto;
		}

		&.nextButton {
			margin-left: auto;
			margin-right: 0.5rem;
		}
	}
`;

const Match = styled.div`
	cursor: pointer;
	display: flex;

	img {
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
	}

	.memberItem {
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		width: 5rem;
	}

	.matchingStatus {
		margin-top: auto;
		font-size: 0.875rem;
		color: rgba(0, 0, 0, 0.5);
	}

	${(props) =>
		props.status === "REFUSED" &&
		css`
			img {
				border: 1px solid red;
				filter: grayscale(50%);
			}

			.matchingStatus {
				color: red;
			}
		`}

	${(props) =>
		props.status === "ACCEPTED" &&
		css`
			img {
				border: 1px solid green;
			}

			.matchingStatus {
				color: green;
			}
		`}
`;
