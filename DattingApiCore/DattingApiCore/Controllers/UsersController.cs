using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DattingApiCore.Data;
using DattingApiCore.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DattingApiCore.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IDatingRepository repo;
        private readonly IMapper mapper;

        public UsersController(IDatingRepository repo, IMapper mapper)
        {
            this.repo = repo;
            this.mapper = mapper;
        }


        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await repo.GetUsers();
            var usersToReturn = mapper.Map<IEnumerable<UserForListDto>>(users);
            return Ok(usersToReturn);
        }


        [HttpGet("{id}", Name ="GetUser")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await repo.GetUser(id);

            var userToReturn = mapper.Map<UserForDetailDto>(user);

            return Ok(userToReturn);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserUpdateDto userUpdateDto)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var userFromRepo = await repo.GetUser(id);
            
            mapper.Map(userUpdateDto, userFromRepo);

            if (await repo.SaveAll())
                return NoContent();

            throw new Exception($"updating user {id} failed on save.");
        }



    }
}